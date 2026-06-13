"use client";

import { ArrowRight, AlertTriangle, CheckCircle, XCircle, Info, Loader2, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import Link from "next/link";

const severityConfig = {
  info: {
    Icon: Info,
    color: "var(--info)",
    border: "rgba(44,120,115,0.35)",
    bg: "rgba(44,120,115,0.06)",
    badge: "badge-info",
    label: "Info",
  },
  warning: {
    Icon: AlertTriangle,
    color: "var(--warning)",
    border: "rgba(184,117,46,0.35)",
    bg: "rgba(184,117,46,0.06)",
    badge: "badge-warning",
    label: "Warning",
  },
  critical: {
    Icon: XCircle,
    color: "var(--danger)",
    border: "rgba(166,32,53,0.35)",
    bg: "rgba(166,32,53,0.06)",
    badge: "badge-critical",
    label: "Critical",
  },
  success: {
    Icon: CheckCircle,
    color: "var(--success)",
    border: "rgba(74,124,89,0.35)",
    bg: "rgba(74,124,89,0.06)",
    badge: "badge-success",
    label: "Positive",
  },
};

export function QuickInsights() {
  const { data: aiInsights, isLoading } = useQuery({
    queryKey: ["quickInsights"],
    queryFn: api.insights.getAll,
  });

  if (isLoading || !aiInsights) {
    return (
      <div className="editorial-card h-full flex flex-col gap-4 p-6">
        <div className="skeleton h-5 w-48" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // Sort: critical first, then warning, then others
  const sorted = [...aiInsights].sort((a, b) => {
    const order: Record<string, number> = { critical: 0, warning: 1, info: 2, success: 3 };
    return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
  });
  const topInsights = sorted.slice(0, 4);

  return (
    <div className="editorial-card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} style={{ color: "var(--accent-blue)" }} />
            <h2 className="editorial-header text-base">AI Recommendations</h2>
          </div>
          <div className="text-[11px] mt-1 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Highest impact priorities
          </div>
        </div>
        <Link
          href="/intelligence"
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors"
          style={{ color: "var(--accent-blue)" }}
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      {/* Insights */}
      <div className="flex-1 space-y-3">
        {topInsights.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No insights yet.{" "}
              <Link href="/intelligence" className="underline" style={{ color: "var(--accent-blue)" }}>
                Run Analysis →
              </Link>
            </p>
          </div>
        ) : topInsights.map((insight) => {
          const cfg = severityConfig[insight.severity as keyof typeof severityConfig] ?? severityConfig.info;
          const Icon = cfg.Icon;
          return (
            <div
              key={insight.id}
              className="p-4 rounded-lg transition-all"
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderLeft: `3px solid ${cfg.color}`,
              }}
            >
              <div className="flex items-start gap-3">
                <Icon size={14} style={{ color: cfg.color, marginTop: 2, flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={cfg.badge}>{cfg.label}</span>
                    <span className="badge-gold text-[9px]">{insight.category}</span>
                  </div>
                  <div className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
                    {insight.title}
                  </div>
                  <div className="text-xs mt-1.5 line-clamp-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {insight.description}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                      {new Date(insight.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: cfg.color }}>
                      {insight.confidence}% conf.
                    </span>
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
