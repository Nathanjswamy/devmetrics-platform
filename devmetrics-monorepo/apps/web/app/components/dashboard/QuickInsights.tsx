"use client";

import { ArrowRight, AlertTriangle, CheckCircle, XCircle, Info, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import Link from "next/link";

const severityConfig = {
  info:     { Icon: Info,          color: "#8052ff", border: "rgba(128,82,255,0.35)",  bg: "rgba(128,82,255,0.06)",  badge: "badge-info",     label: "Info" },
  warning:  { Icon: AlertTriangle, color: "#ffb829", border: "rgba(255,184,41,0.35)",  bg: "rgba(255,184,41,0.06)",  badge: "badge-warning",  label: "Warning" },
  critical: { Icon: XCircle,       color: "#ff4d6a", border: "rgba(255,77,106,0.35)",  bg: "rgba(255,77,106,0.06)",  badge: "badge-critical", label: "Critical" },
  success:  { Icon: CheckCircle,   color: "#15846e", border: "rgba(21,132,110,0.35)",  bg: "rgba(21,132,110,0.06)",  badge: "badge-success",  label: "Positive" },
};

export function QuickInsights() {
  const { data: aiInsights, isLoading } = useQuery({
    queryKey: ["quickInsights"],
    queryFn: api.insights.getAll,
  });

  if (isLoading || !aiInsights) {
    return (
      <div className="editorial-card h-full flex flex-col gap-4 p-6">
        <div className="skeleton h-3 w-40 mb-2" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-20 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  const sorted = [...aiInsights].sort((a, b) => {
    const order: Record<string, number> = { critical: 0, warning: 1, info: 2, success: 3 };
    return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
  });
  const topInsights = sorted.slice(0, 4);

  return (
    <div className="editorial-card h-full flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles size={13} style={{ color: "var(--plum)" }} />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--smoke)",
              textTransform: "uppercase",
              letterSpacing: "0.10em",
            }}
          >
            AI Recommendations
          </span>
        </div>
        <Link
          href="/intelligence"
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--plum)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          View all <ArrowRight size={11} />
        </Link>
      </div>

      {/* Insights */}
      <div className="flex-1 space-y-3">
        {topInsights.length === 0 ? (
          <div className="py-10 text-center">
            <p style={{ fontSize: "14px", color: "var(--smoke)", letterSpacing: "0.025em" }}>
              No insights yet.{" "}
              <Link href="/intelligence" style={{ color: "var(--plum)", textDecoration: "underline" }}>
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
              style={{
                padding: "1rem",
                borderRadius: "1rem",
                border: `1px solid ${cfg.border}`,
                borderLeft: `2px solid ${cfg.color}`,
                background: cfg.bg,
              }}
            >
              <div className="flex items-start gap-3">
                <Icon size={13} style={{ color: cfg.color, marginTop: 2, flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={cfg.badge}>{cfg.label}</span>
                    <span className="badge-neutral">{insight.category}</span>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "var(--bone)",
                      letterSpacing: "0.021em",
                    }}
                  >
                    {insight.title}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--ash)",
                      marginTop: "4px",
                      letterSpacing: "0.021em",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {insight.description}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span style={{ fontSize: "11px", color: "var(--smoke)", fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.05em" }}>
                      {new Date(insight.createdAt).toLocaleDateString()}
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: cfg.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
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
