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
          background: "#1E293B",
          border: "1px solid var(--border)",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.5)",
          borderRadius: "8px"
        }}
      >
        <div className="font-semibold text-white mb-2">{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-300">{p.name}:</span>
            <span className="font-semibold text-white">{p.value}</span>
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
      <div className="editorial-card h-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="editorial-card h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="editorial-header text-lg">Sprint Performance</h2>
          <div className="text-xs text-text-secondary mt-1 tracking-wide uppercase">Last 6 sprints</div>
        </div>
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          {(["velocity", "lead_time"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 text-xs font-semibold uppercase tracking-wider ${activeTab === tab ? "text-text-primary" : "text-text-muted hover:text-text-secondary"}`}
              style={{
                borderBottom: activeTab === tab ? "2px solid var(--text-primary)" : "2px solid transparent"
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
            <BarChart data={sprintData} barGap={8} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="1 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="sprint"
                scale="point"
                padding={{ left: 30, right: 30 }}
                tick={{ fill: "#8C867A", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.replace("Sprint ", "S")}
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "Inter" }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(43,107,109,0.05)" }} />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                formatter={(v) => <span style={{ color: "#5C584E" }}>{v}</span>}
              />
              <Bar dataKey="planned" name="Planned" fill="var(--border-bright)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="var(--text-primary)" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sprintData}>
              <defs>
                <linearGradient id="leadTimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C86A3D" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#C86A3D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="1 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="sprint"
                tick={{ fill: "#8C867A", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.replace("Sprint ", "S")}
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "Inter" }}
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
                stroke="#C86A3D"
                strokeWidth={1.5}
                fill="url(#leadTimeGradient)"
                dot={{ fill: "var(--surface)", stroke: "#C86A3D", strokeWidth: 1.5, r: 4 }}
                activeDot={{ r: 6, fill: "#C86A3D", stroke: "var(--surface)", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
