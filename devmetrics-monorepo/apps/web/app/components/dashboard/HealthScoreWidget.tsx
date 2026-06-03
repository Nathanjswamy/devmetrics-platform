"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { Loader2 } from "lucide-react";

export function HealthScoreWidget() {
  const { data: healthScore, isLoading } = useQuery({
    queryKey: ["healthScore"],
    queryFn: api.metrics.getHealth,
  });

  if (isLoading || !healthScore) {
    return (
      <div className="bauhaus-card p-5 h-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-text-muted" />
      </div>
    );
  }

  const score = healthScore.overall;
  const scoreColor =
    score >= 85 ? "#787B4E" : score >= 70 ? "#53798C" : score >= 55 ? "#DE7A35" : "#D05A44";

  const radialData = [{ value: score, fill: scoreColor }];

  const getLabel = (s: number) =>
    s >= 85 ? "Elite" : s >= 70 ? "High" : s >= 55 ? "Medium" : "Low";

  return (
    <div className="bauhaus-card p-5 h-full flex flex-col">
      <div className="section-header">
        <div>
          <div className="section-title">Engineering Health</div>
          <div className="section-subtitle">Composite score</div>
        </div>
        <div
          className="px-2 py-0.5 rounded-lg text-xs font-semibold"
          style={{ background: `${scoreColor}18`, color: scoreColor }}
        >
          {getLabel(score)}
        </div>
      </div>

      {/* Radial gauge */}
      <div className="flex items-center justify-center relative" style={{ height: "160px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="62%"
            outerRadius="82%"
            barSize={12}
            data={radialData}
            startAngle={220}
            endAngle={-40}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            {/* Background track */}
            <RadialBar
              background={{ fill: "#DFD8C8" }} // var(--surface-3) roughly
              dataKey="value"
              angleAxisId={0}
              cornerRadius={0}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Center overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color: scoreColor }}>
            {score}
          </span>
          <span className="text-xs text-text-muted mt-0.5">out of 100</span>
        </div>
      </div>

      {/* Dimension bars */}
      <div className="mt-4 space-y-2.5">
        {healthScore.dimensions.map((dim) => (
          <div key={dim.label} className="flex items-center gap-3">
            <div className="w-20 text-[11px] text-text-muted truncate">{dim.label}</div>
            <div className="flex-1 h-2 rounded-none" style={{ background: "var(--surface-3)" }}>
              <div
                className="h-full rounded-none transition-all duration-1000"
                style={{ width: `${dim.score}%`, background: scoreColor }}
              />
            </div>
            <div className="w-7 text-[11px] font-semibold text-text-secondary text-right">
              {dim.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
