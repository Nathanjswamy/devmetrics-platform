"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl p-3 text-xs"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "4px 4px 0px 0px rgba(44,42,38,0.05)",
          borderRadius: "0px"
        }}
      >
        <div className="font-semibold text-text-primary mb-2">{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-text-muted">{p.name}:</span>
            <span className="font-semibold text-text-primary">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function SparklineChart() {
  const [activeTab, setActiveTab] = useState<"velocity" | "lead_time">("velocity");
  const { data: sprintData, isLoading } = useQuery({
    queryKey: ["sprintAnalytics"],
    queryFn: api.analytics.getSprints,
  });

  if (isLoading || !sprintData) {
    return (
      <div className="bauhaus-card p-5 h-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="bauhaus-card p-5 h-full">
      <div className="section-header">
        <div>
          <div className="section-title">Sprint Performance</div>
          <div className="section-subtitle">Last 6 sprints · Story points & delivery</div>
        </div>
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          {(["velocity", "lead_time"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 py-1.5 text-xs font-semibold transition-all duration-200"
              style={{
                background: activeTab === tab ? "rgba(43,107,109,0.1)" : "var(--surface-2)",
                color: activeTab === tab ? "#2B6B6D" : "var(--text-muted)",
              }}
            >
              {tab === "velocity" ? "Velocity" : "Lead Time"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: "220px" }}>
        {activeTab === "velocity" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sprintData} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#D5CEBC" vertical={false} />
              <XAxis
                dataKey="sprint"
                tick={{ fill: "#8C867A", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.replace("Sprint ", "S")}
              />
              <YAxis
                tick={{ fill: "#8C867A", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(43,107,109,0.05)" }} />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                formatter={(v) => <span style={{ color: "#5C584E" }}>{v}</span>}
              />
              <Bar dataKey="planned" name="Planned" fill="#DFD8C8" radius={[0, 0, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#2B6B6D" radius={[0, 0, 0, 0]}>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sprintData}>
              <defs>
                <linearGradient id="leadTimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DE7A35" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#DE7A35" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#D5CEBC" vertical={false} />
              <XAxis
                dataKey="sprint"
                tick={{ fill: "#8C867A", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.replace("Sprint ", "S")}
              />
              <YAxis
                tick={{ fill: "#8C867A", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={28}
                unit="d"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="leadTime"
                name="Lead Time (days)"
                stroke="#DE7A35"
                strokeWidth={2}
                fill="url(#leadTimeGradient)"
                dot={{ fill: "#DE7A35", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "#D05A44" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
