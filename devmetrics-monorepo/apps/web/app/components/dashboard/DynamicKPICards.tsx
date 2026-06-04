"use client";

import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export function DynamicKPICards() {
  const { data, isLoading } = useQuery({
    queryKey: ["executiveMetrics"],
    queryFn: api.metrics.getExecutive,
  });

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="editorial-card h-32 flex items-center justify-center">
            <Loader2 className="animate-spin text-text-muted" />
          </div>
        ))}
      </div>
    );
  }

  const kpis = data.kpis || [];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-${Math.max(kpis.length, 2)} gap-8`}>
      {kpis.map((metric: any) => {
        const isPositiveTrend =
          metric.trendDirection === "up" ? metric.isGoodUp : !metric.isGoodUp;
        const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;
        const trendColorClass = isPositiveTrend ? "text-accent-green" : "text-accent-orange";

        return (
          <div
            key={metric.name}
            className="editorial-card flex flex-col justify-between p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">{metric.name}</h3>
                <p className="text-xs text-text-muted mt-1">{metric.description}</p>
              </div>
              {metric.trend !== undefined && (
                <div className={`flex items-center gap-1 text-xs font-medium ${trendColorClass}`}>
                  <TrendIcon size={14} strokeWidth={2.5} />
                  {Math.abs(metric.trend)}%
                </div>
              )}
            </div>

            {/* Metric value */}
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-serif text-text-primary tracking-tight">
                {metric.value}
              </span>
              <span className="text-sm font-medium text-text-muted">{metric.unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
