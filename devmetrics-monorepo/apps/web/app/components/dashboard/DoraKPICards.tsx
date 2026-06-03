"use client";

import { Clock, Rocket, ShieldAlert, HeartPulse, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

const iconMap: Record<string, React.ElementType> = {
  Clock,
  Rocket,
  ShieldAlert,
  HeartPulse,
};

const accentColors = [
  { bg: "rgba(208,90,68,0.1)", border: "rgba(208,90,68,0.25)", icon: "#D05A44" }, // Terracotta
  { bg: "rgba(43,107,109,0.1)", border: "rgba(43,107,109,0.25)", icon: "#2B6B6D" }, // Teal
  { bg: "rgba(120,123,78,0.1)", border: "rgba(120,123,78,0.25)", icon: "#787B4E" }, // Olive
  { bg: "rgba(222,122,53,0.1)", border: "rgba(222,122,53,0.25)", icon: "#DE7A35" }, // Orange
];

export function DoraKPICards() {
  const { data, isLoading } = useQuery({
    queryKey: ["executiveMetrics"],
    queryFn: api.metrics.getExecutive,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-32 rounded-2xl flex items-center justify-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <Loader2 className="animate-spin text-text-muted" />
          </div>
        ))}
      </div>
    );
  }

  const doraMetrics = data?.dora || [];

  return (
    <div className={`grid grid-cols-${doraMetrics.length || 2} gap-4`}>
      {doraMetrics.map((metric, i) => {
        const Icon = iconMap[metric.icon] || Clock;
        const color = accentColors[i];
        const isPositiveTrend =
          metric.trendDirection === "up" ? metric.isGoodUp : !metric.isGoodUp;
        const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;
        const trendColor = isPositiveTrend ? "#34D399" : "#FB7185";

        return (
          <div
            key={metric.name}
            className="bauhaus-card p-5 cursor-pointer transition-transform hover:-translate-y-0.5 group overflow-hidden"
          >
            {/* Geometric accent strip */}
            <div 
              className="absolute top-0 left-0 bottom-0 w-1.5 transition-all group-hover:w-2"
              style={{ background: color.icon }}
            />

            {/* Header */}
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div
                className="w-10 h-10 rounded-none flex items-center justify-center transform rotate-3"
                style={{ background: color.bg, border: `2px solid ${color.border}` }}
              >
                <Icon size={18} style={{ color: color.icon }} className="-rotate-3" />
              </div>
              <div
                className="flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-bold tracking-wide uppercase border"
                style={{
                  background: isPositiveTrend ? "rgba(120,123,78,0.1)" : "rgba(208,90,68,0.1)",
                  color: isPositiveTrend ? "#787B4E" : "#D05A44",
                  borderColor: isPositiveTrend ? "rgba(120,123,78,0.2)" : "rgba(208,90,68,0.2)"
                }}
              >
                <TrendIcon size={12} strokeWidth={3} />
                {Math.abs(metric.trend)}%
              </div>
            </div>

            {/* Metric value */}
            <div className="relative z-10">
              <div className="flex items-end gap-1 mb-0.5">
                <span className="text-3xl font-bold text-text-primary tracking-tight">
                  {metric.value}
                </span>
                <span className="text-sm text-text-muted mb-1">{metric.unit}</span>
              </div>
              <div className="text-sm font-semibold text-text-primary mb-0.5">{metric.name}</div>
              <div className="text-xs text-text-muted">{metric.description}</div>
            </div>

            {/* Bottom progress indicator */}
            <div className="mt-4 relative z-10">
              <div className="h-1 rounded-none overflow-hidden" style={{ background: "var(--surface-3)" }}>
                <div
                  className="h-full transition-all duration-1000"
                  style={{
                    width: `${isPositiveTrend ? 70 + Math.abs(metric.trend) : 100 - Math.abs(metric.trend)}%`,
                    background: color.icon,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
