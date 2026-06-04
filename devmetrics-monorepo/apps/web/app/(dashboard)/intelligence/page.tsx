"use client";

import { TopNav } from "../../components/TopNav";
import { Brain, AlertTriangle, CheckCircle, XCircle, Info, Sparkles, ArrowRight, Clock, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

const severityConfig = {
  info: {
    Icon: Info,
    color: "var(--text-secondary)",
    bg: "var(--surface)",
    border: "var(--border)",
    tagBg: "var(--surface-2)",
    label: "Info",
  },
  warning: {
    Icon: AlertTriangle,
    color: "#C86A3D", // Burnt Orange
    bg: "rgba(200,106,61,0.02)",
    border: "rgba(200,106,61,0.2)",
    tagBg: "rgba(200,106,61,0.1)",
    label: "Warning",
  },
  critical: {
    Icon: XCircle,
    color: "#0F172A", // Navy
    bg: "rgba(15,23,42,0.02)",
    border: "rgba(15,23,42,0.2)",
    tagBg: "rgba(15,23,42,0.1)",
    label: "Critical",
  },
  success: {
    Icon: CheckCircle,
    color: "#7A8B6F", // Sage Green
    bg: "rgba(122,139,111,0.02)",
    border: "rgba(122,139,111,0.2)",
    tagBg: "rgba(122,139,111,0.1)",
    label: "Positive",
  },
};

export default function IntelligencePage() {
  const { data: aiInsights, isLoading } = useQuery({
    queryKey: ["allInsights"],
    queryFn: api.insights.getAll,
  });

  if (isLoading || !aiInsights) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopNav title="AI Intelligence Center" subtitle="AI-generated engineering insights and recommendations" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="animate-spin text-text-muted" />
        </main>
      </div>
    );
  }

  const criticalCount = aiInsights.filter((i) => i.severity === "critical").length;
  const warningCount = aiInsights.filter((i) => i.severity === "warning").length;
  const positiveCount = aiInsights.filter((i) => i.severity === "success").length;

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        title="AI Intelligence Center"
        subtitle="AI-generated engineering insights and recommendations"
      />

      <main className="flex-1 p-6">
        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Insights", value: aiInsights.length, color: "var(--text-primary)", bg: "var(--surface-2)" },
            { label: "Critical", value: criticalCount, color: "#0F172A", bg: "rgba(15,23,42,0.05)" },
            { label: "Warnings", value: warningCount, color: "#C86A3D", bg: "rgba(200,106,61,0.05)" },
            { label: "Positive", value: positiveCount, color: "#7A8B6F", bg: "rgba(122,139,111,0.05)" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="editorial-card p-6 flex flex-col justify-between"
              style={{ background: stat.bg }}
            >
              <div className="text-sm font-semibold text-text-secondary uppercase tracking-widest mb-4">{stat.label}</div>
              <div
                className="text-4xl font-serif"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* AI Engine status banner */}
        <div
          className="flex items-center justify-between px-6 py-4 mb-8 bg-surface border border-border"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center bg-surface-2 border border-border"
            >
              <Sparkles size={20} className="text-text-primary" />
            </div>
            <div>
              <div className="text-sm font-bold font-serif text-text-primary uppercase tracking-widest">AI Engine Active</div>
              <div className="text-xs text-text-secondary mt-0.5">
                Analyzing 14-day rolling window · Next run in{" "}
                <span className="text-text-primary font-medium">2h 14m</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-text-secondary font-medium tracking-widest uppercase border-r border-border pr-4">Model: GPT-4o</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-xs text-text-primary font-semibold uppercase tracking-widest">Running</span>
            </div>
          </div>
        </div>

        {/* Insights grid */}
        <div className="space-y-4">
          {aiInsights.map((insight) => {
            const cfg = severityConfig[insight.severity as keyof typeof severityConfig];
            const SeverityIcon = cfg.Icon;

            return (
              <div
                key={insight.id}
                className="editorial-card p-6 hover:bg-surface-2 transition-colors cursor-pointer group"
                style={{
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  borderLeft: `4px solid ${cfg.color}`
                }}
              >
                <div className="flex items-start gap-6">
                  {/* Severity icon */}
                  <div
                    className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: cfg.tagBg }}
                  >
                    <SeverityIcon size={24} style={{ color: cfg.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded"
                            style={{ background: cfg.tagBg, color: cfg.color }}
                          >
                            {cfg.label}
                          </span>
                          <span className="text-xs font-bold text-text-secondary px-2.5 py-0.5 rounded uppercase tracking-widest border border-border bg-surface-2">
                            {insight.category}
                          </span>
                          {insight.affectedTeam && (
                            <span className="text-xs font-bold text-text-primary px-2.5 py-0.5 rounded uppercase tracking-widest border border-border bg-surface-2">
                              {insight.affectedTeam}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-serif font-bold text-text-primary">{insight.title}</h3>
                      </div>
                      {/* Confidence badge */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-3xl font-serif" style={{ color: cfg.color }}>
                          {insight.confidence}%
                        </div>
                        <div className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold mt-1">confidence</div>
                      </div>
                    </div>

                    <p className="text-base text-text-secondary leading-relaxed mb-6">
                      {insight.description}
                    </p>

                    {/* Recommendation */}
                    <div
                      className="flex items-start gap-3 p-4 editorial-card mb-4"
                      style={{ background: "var(--surface-2)", border: `1px solid ${cfg.border}` }}
                    >
                      <Brain size={16} style={{ color: cfg.color }} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-text-secondary font-bold uppercase tracking-widest mb-1">
                          AI Recommendation
                        </div>
                        <p className="text-sm text-text-primary font-medium leading-relaxed">{insight.recommendation}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-text-muted font-mono">
                        <Clock size={12} />
                        {insight.createdAt}
                      </div>
                      <button
                        className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest transition-colors group-hover:underline"
                        style={{ color: cfg.color }}
                      >
                        Take action <ArrowRight size={14} strokeWidth={2.5} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
