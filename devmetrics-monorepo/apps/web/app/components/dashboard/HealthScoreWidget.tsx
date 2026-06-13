"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export function HealthScoreWidget() {
  const { data: healthScore, isLoading } = useQuery({
    queryKey: ["healthScore"],
    queryFn: api.metrics.getHealth,
  });

  if (isLoading || !healthScore) {
    return (
      <div className="editorial-card flex flex-col gap-4 p-6">
        <div className="skeleton h-5 w-40" />
        <div className="skeleton h-40 w-40 rounded-full mx-auto" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-2 w-full" />)}
        </div>
      </div>
    );
  }

  const score = healthScore.overall;
  // Luxury palette — no neon
  const scoreColor =
    score >= 85 ? "#3A9B95"   // teal
    : score >= 70 ? "#C9A96E" // gold
    : score >= 55 ? "#B8752E" // amber
    : "#A62035";              // maroon/crimson

  const radialData = [{ value: score, fill: scoreColor }];
  const getLabel = (s: number) =>
    s >= 85 ? "Elite" : s >= 70 ? "High" : s >= 55 ? "Medium" : "At Risk";

  return (
    <div className="editorial-card flex flex-col h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="editorial-header text-base">Engineering Health</h2>
          <div className="text-[11px] mt-1 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Composite score
          </div>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-widest"
          style={{
            background: `${scoreColor}18`,
            color: scoreColor,
            border: `1px solid ${scoreColor}40`,
          }}
        >
          {getLabel(score)}
        </span>
      </div>

      {/* Radial gauge */}
      <div className="flex items-center justify-center relative" style={{ height: "150px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="50%"
            innerRadius="62%" outerRadius="82%"
            barSize={10}
            data={radialData}
            startAngle={220} endAngle={-40}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: "var(--surface-3)" }}
              dataKey="value"
              angleAxisId={0}
              cornerRadius={4}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-4xl font-bold" style={{ color: scoreColor, letterSpacing: "-0.03em" }}>
            {score}
          </span>
          <span className="text-[10px] uppercase tracking-widest mt-1" style={{ color: "var(--text-muted)" }}>
            out of 100
          </span>
        </div>
      </div>

      {/* Dimension bars */}
      <div className="mt-6 space-y-3.5">
        {healthScore.dimensions.map((dim) => (
          <div key={dim.label} className="flex items-center gap-3">
            <div className="w-20 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              {dim.label}
            </div>
            <div className="flex-1 h-[2px] rounded-full" style={{ background: "var(--surface-3)" }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${dim.score}%`, background: scoreColor }}
              />
            </div>
            <div className="w-7 text-xs font-bold text-right font-serif" style={{ color: "var(--text-primary)" }}>
              {dim.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
