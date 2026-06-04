"use client";

import { ArrowRight, AlertTriangle, CheckCircle, XCircle, Info, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import Link from "next/link";

const severityConfig = {
  info: { Icon: Info, color: "var(--text-secondary)", bg: "var(--surface-2)", border: "var(--border)" },
  warning: { Icon: AlertTriangle, color: "#C86A3D", bg: "rgba(200,106,61,0.05)", border: "#C86A3D" },
  critical: { Icon: XCircle, color: "#0F172A", bg: "rgba(15,23,42,0.05)", border: "#0F172A" },
  success: { Icon: CheckCircle, color: "#7A8B6F", bg: "rgba(122,139,111,0.05)", border: "#7A8B6F" },
};

export function QuickInsights() {
  const { data: aiInsights, isLoading } = useQuery({
    queryKey: ["quickInsights"],
    queryFn: api.insights.getAll,
  });

  if (isLoading || !aiInsights) {
    return (
      <div className="editorial-card h-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-text-muted" />
      </div>
    );
  }

  const topInsights = aiInsights.slice(0, 3);

  return (
    <div className="editorial-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="editorial-header text-lg">AI Insights</h2>
          <div className="text-xs text-text-secondary mt-1 tracking-wide uppercase">Latest recommendations</div>
        </div>
        <Link
          href="/intelligence"
          className="text-xs text-text-primary hover:text-text-secondary font-medium transition-colors flex items-center gap-1 uppercase tracking-widest"
        >
          View all <ArrowRight size={13} />
        </Link>
      </div>

      <div className="flex-1 space-y-4">
        {topInsights.map((insight) => {
          const cfg = severityConfig[insight.severity as keyof typeof severityConfig] || severityConfig.info;
          const Icon = cfg.Icon;
          return (
            <div
              key={insight.id}
              className="p-4 transition-all hover:bg-surface-2 border border-border"
              style={{
                borderLeft: `2px solid ${cfg.border}`,
              }}
            >
              <div className="flex items-start gap-2">
                <Icon size={14} style={{ color: cfg.color }} className="mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-text-primary">
                    {insight.title}
                  </div>
                  <div className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                    {insight.description}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-mono text-text-muted">{insight.createdAt}</span>
                    <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: cfg.color }}>
                      {insight.confidence}% conf.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
