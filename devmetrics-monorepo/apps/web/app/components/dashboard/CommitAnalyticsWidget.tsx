"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { Loader2, GitCommit, Calendar } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl p-3 text-xs"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "4px 4px 0px 0px rgba(44,42,38,0.05)",
        }}
      >
        <div className="font-semibold text-text-primary mb-2">{label}</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-green" />
          <span className="text-text-muted">Commits:</span>
          <span className="font-semibold text-text-primary">{payload[0].value}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function CommitAnalyticsWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ["commitAnalytics"],
    queryFn: async () => {
      const res = await fetch("/api/v1/analytics/commits");
      return res.json();
    },
  });

  if (isLoading || !data) {
    return (
      <div className="editorial-card h-64 flex items-center justify-center">
        <Loader2 className="animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="editorial-card h-full flex flex-col p-6">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <GitCommit className="text-accent-green" size={20} />
            <h2 className="editorial-header text-lg m-0">Commit Analytics</h2>
          </div>
          <div className="text-xs text-text-secondary uppercase tracking-wider">30-Day Activity Trend</div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="text-right">
            <div className="text-text-primary text-xl font-bold">{data.codingStreaks} <span className="text-xs font-normal text-text-muted">days</span></div>
            <div className="text-[10px] uppercase tracking-wide text-text-secondary">Current Streak</div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.dailyActivity}>
            <defs>
              <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="1 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#8C867A", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v.split("-").slice(1).join("/")}
            />
            <YAxis
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#commitGradient)"
              activeDot={{ r: 6, fill: "#10B981", stroke: "var(--surface)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
