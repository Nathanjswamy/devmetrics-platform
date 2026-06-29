"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

function KPISkeleton() {
  return (
    <div className="editorial-card flex flex-col justify-between p-6 min-h-[130px]">
      <div className="skeleton h-2.5 w-20 mb-8" />
      <div className="skeleton h-10 w-24" />
      <div className="skeleton h-2 w-14 mt-4" />
    </div>
  );
}

export function DynamicKPICards({ userId }: { userId?: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["executiveMetrics", userId || ""],
    queryFn: () => api.metrics.getExecutive(userId || ""),
    enabled: !!userId,
  });

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <KPISkeleton key={i} />)}
      </div>
    );
  }

  const kpis = data.kpis || [];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-${Math.min(Math.max(kpis.length, 2), 4)} gap-4`}>
      {kpis.map((metric: any) => {
        const isPositiveTrend =
          metric.trendDirection === "up" ? metric.isGoodUp : !metric.isGoodUp;
        const trendColor = isPositiveTrend ? "#15846e" : "#ff4d6a";

        const TrendIcon = metric.trend === 0
          ? Minus
          : metric.trendDirection === "up"
          ? TrendingUp
          : TrendingDown;

        return (
          <div key={metric.name} className="editorial-card flex flex-col justify-between p-6 min-h-[130px]">
            {/* Label — eyebrow kicker */}
            <div className="flex items-start justify-between mb-4">
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--smoke)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {metric.name}
              </span>
              {metric.trend !== undefined && (
                <div
                  className="flex items-center gap-1"
                  style={{ fontSize: "11px", fontWeight: 600, color: (metric.trend === 0 || metric.value === 0 || metric.value === "0.0") ? "var(--smoke)" : trendColor }}
                >
                  {(metric.trend === 0 || metric.value === 0 || metric.value === "0.0") ? (
                    <span className="px-1 text-slate-500">-</span>
                  ) : (
                    <>
                      <TrendIcon size={12} strokeWidth={2.5} />
                      {Math.abs(metric.trend)}%
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Value — display weight 200, ultra-tight tracking */}
            <div className="flex items-baseline gap-1.5">
              <span
                style={{
                  fontWeight: 200,
                  fontSize: "3rem",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  color: "var(--bone)",
                }}
              >
                {metric.value}
              </span>
              {metric.unit && (
                <span style={{ fontSize: "13px", color: "var(--smoke)", letterSpacing: "0.025em" }}>
                  {metric.unit}
                </span>
              )}
            </div>

            {/* Trend label */}
            {metric.description && (
              <p style={{ fontSize: "12px", color: "var(--smoke)", marginTop: "10px", letterSpacing: "0.025em" }}>
                {metric.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
