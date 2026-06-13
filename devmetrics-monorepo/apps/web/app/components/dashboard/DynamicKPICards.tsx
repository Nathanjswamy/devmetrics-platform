"use client";

import { TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

function KPISkeleton() {
  return (
    <div className="editorial-card flex flex-col justify-between p-6 min-h-[140px]">
      <div className="skeleton h-3 w-24 mb-6" />
      <div className="skeleton h-12 w-20" />
      <div className="skeleton h-2 w-16 mt-4" />
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
      {kpis.map((metric: any, idx: number) => {
        const isPositiveTrend =
          metric.trendDirection === "up" ? metric.isGoodUp : !metric.isGoodUp;
        const trendColor = isPositiveTrend
          ? "var(--severity-success)"
          : "var(--severity-critical)";

        const TrendIcon = metric.trend === 0
          ? Minus
          : metric.trendDirection === "up"
          ? TrendingUp
          : TrendingDown;

        // Alternate accent on first card for premium look
        const isFirst = idx === 0;

        return (
          <div
            key={metric.name}
            className="editorial-card flex flex-col justify-between p-6 min-h-[140px]"
            style={isFirst ? { borderTop: "2px solid var(--accent-maroon)" } : {}}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
                  {metric.name}
                </h3>
                {metric.description && (
                  <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: "160px" }}>
                    {metric.description}
                  </p>
                )}
              </div>
              {metric.trend !== undefined && (
                <div className="flex items-center gap-1 text-xs font-bold flex-shrink-0" style={{ color: trendColor }}>
                  <TrendIcon size={13} strokeWidth={2.5} />
                  {Math.abs(metric.trend)}%
                </div>
              )}
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-4xl font-bold leading-none" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
                {metric.value}
              </span>
              {metric.unit && (
                <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{metric.unit}</span>
              )}
            </div>

            {/* Trend bar */}
            {metric.trend !== undefined && (
              <div className="mt-4 h-0.5 w-full rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(Math.abs(metric.trend) * 3, 100)}%`,
                    background: trendColor,
                    opacity: 0.7,
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
