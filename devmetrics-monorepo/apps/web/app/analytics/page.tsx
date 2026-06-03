"use client";

import { TopNav } from "../components/TopNav";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { TrendingDown, TrendingUp, Loader2 } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl p-3 text-xs"
        style={{
          background: "#1C1F2A",
          border: "1px solid #2A2E42",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
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

const summaryStats = [
  { label: "Avg Velocity", value: "79", unit: "pts/sprint", trend: "+12%", up: true },
  { label: "Lead Time (Avg)", value: "2.6", unit: "days", trend: "-18%", up: true },
  { label: "Avg Bug Rate", value: "3.5", unit: "%", trend: "-24%", up: true },
  { label: "Throughput", value: "83", unit: "% planned", trend: "+8%", up: true },
];

export default function AnalyticsPage() {
  const { data: sprintData, isLoading: loadingSprints } = useQuery({
    queryKey: ["sprintAnalytics"],
    queryFn: api.analytics.getSprints,
  });

  const { data: leadTimeDistribution, isLoading: loadingLeadTime } = useQuery({
    queryKey: ["leadTimeDistribution"],
    queryFn: api.analytics.getLeadTime,
  });

  if (loadingSprints || loadingLeadTime || !sprintData || !leadTimeDistribution) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopNav title="Advanced Analytics" subtitle="Sprint-over-sprint comparisons and lead time distribution" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="animate-spin text-text-muted" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        title="Advanced Analytics"
        subtitle="Sprint-over-sprint comparisons and lead time distribution"
      />

      <main className="flex-1 p-6 space-y-6">
        {/* Summary row */}
        <div className="grid grid-cols-4 gap-4">
          {summaryStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="text-xs text-text-muted mb-1">{stat.label}</div>
              <div className="flex items-end gap-1.5">
                <span className="text-2xl font-bold text-text-primary">{stat.value}</span>
                <span className="text-xs text-text-muted mb-0.5">{stat.unit}</span>
              </div>
              <div
                className="flex items-center gap-1 mt-1.5 text-[11px] font-semibold"
                style={{ color: stat.up ? "#34D399" : "#FB7185" }}
              >
                {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.trend} vs prev period
              </div>
            </div>
          ))}
        </div>

        {/* Velocity + Bug Rate dual chart */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="section-header">
            <div>
              <div className="section-title">Sprint Velocity vs Bug Rate</div>
              <div className="section-subtitle">6-sprint trend comparison</div>
            </div>
          </div>
          <div style={{ height: "240px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sprintData}>
                <defs>
                  <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2130" vertical={false} />
                <XAxis
                  dataKey="sprint"
                  tick={{ fill: "#4A5080", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v.replace("Sprint ", "S")}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "#4A5080", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "#4A5080", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                  unit="%"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  formatter={(v) => <span style={{ color: "#8B91B3" }}>{v}</span>}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="velocity"
                  name="Velocity (pts)"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  dot={{ fill: "#6366F1", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: "#818CF8" }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bugRate"
                  name="Bug Rate (%)"
                  stroke="#F43F5E"
                  strokeWidth={2.5}
                  strokeDasharray="5 3"
                  dot={{ fill: "#F43F5E", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: "#FB7185" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead time distribution + Area chart */}
        <div className="grid grid-cols-2 gap-5">
          {/* Lead time histogram */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="section-header">
              <div>
                <div className="section-title">Lead Time Distribution</div>
                <div className="section-subtitle">Current sprint</div>
              </div>
            </div>
            <div style={{ height: "200px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadTimeDistribution} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2130" vertical={false} />
                  <XAxis
                    dataKey="range"
                    tick={{ fill: "#4A5080", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#4A5080", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={24}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
                  <Bar dataKey="count" name="PRs" radius={[4, 4, 0, 0]}>
                    {leadTimeDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.range === "0-4h" || entry.range === "4-12h"
                            ? "#6366F1"
                            : entry.range === "12-24h"
                            ? "#06B6D4"
                            : entry.range === "1-3d"
                            ? "#F59E0B"
                            : "#F43F5E"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Pct breakdown */}
            <div className="flex justify-between mt-3">
              {leadTimeDistribution.map((d) => (
                <div key={d.range} className="text-center">
                  <div className="text-xs font-bold text-text-primary">{d.pct}%</div>
                  <div className="text-[9px] text-text-muted">{d.range}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Area chart: planned vs completed trend */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="section-header">
              <div>
                <div className="section-title">Planned vs Completed</div>
                <div className="section-subtitle">Story point delivery rate</div>
              </div>
            </div>
            <div style={{ height: "200px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sprintData}>
                  <defs>
                    <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2A2E42" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#2A2E42" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2130" vertical={false} />
                  <XAxis
                    dataKey="sprint"
                    tick={{ fill: "#4A5080", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v.replace("Sprint ", "S")}
                  />
                  <YAxis
                    tick={{ fill: "#4A5080", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                    formatter={(v) => <span style={{ color: "#8B91B3" }}>{v}</span>}
                  />
                  <Area
                    type="monotone"
                    dataKey="planned"
                    name="Planned"
                    stroke="#2A2E42"
                    strokeWidth={2}
                    fill="url(#plannedGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    name="Completed"
                    stroke="#6366F1"
                    strokeWidth={2.5}
                    fill="url(#completedGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
