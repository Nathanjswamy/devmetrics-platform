"use client";

import { TopNav } from "../components/TopNav";
import { Brain, AlertTriangle, CheckCircle, XCircle, Info, Sparkles, ArrowRight, Clock, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

const severityConfig = {
  info: {
    Icon: Info,
    color: "#53798C", // Blue
    bg: "rgba(83,121,140,0.06)",
    border: "rgba(83,121,140,0.15)",
    tagBg: "rgba(83,121,140,0.12)",
    label: "Info",
  },
  warning: {
    Icon: AlertTriangle,
    color: "#DE7A35", // Orange
    bg: "rgba(222,122,53,0.06)",
    border: "rgba(222,122,53,0.2)",
    tagBg: "rgba(222,122,53,0.12)",
    label: "Warning",
  },
  critical: {
    Icon: XCircle,
    color: "#D05A44", // Terracotta
    bg: "rgba(208,90,68,0.06)",
    border: "rgba(208,90,68,0.2)",
    tagBg: "rgba(208,90,68,0.12)",
    label: "Critical",
  },
  success: {
    Icon: CheckCircle,
    color: "#787B4E", // Olive
    bg: "rgba(120,123,78,0.06)",
    border: "rgba(120,123,78,0.2)",
    tagBg: "rgba(120,123,78,0.12)",
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
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Insights", value: aiInsights.length, color: "#2B6B6D", bg: "rgba(43,107,109,0.08)" }, // Teal
            { label: "Critical", value: criticalCount, color: "#D05A44", bg: "rgba(208,90,68,0.08)" },
            { label: "Warnings", value: warningCount, color: "#DE7A35", bg: "rgba(222,122,53,0.08)" },
            { label: "Positive", value: positiveCount, color: "#787B4E", bg: "rgba(120,123,78,0.08)" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bauhaus-card p-4 flex items-center gap-3"
              style={{ background: stat.bg }}
            >
              <div
                className="text-3xl font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* AI Engine status banner */}
        <div
          className="bauhaus-card flex items-center justify-between p-4 mb-6"
          style={{
            background: "rgba(43,107,109,0.05)",
            border: "1px solid rgba(43,107,109,0.2)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-sm flex items-center justify-center"
              style={{ background: "rgba(43,107,109,0.15)" }}
            >
              <Sparkles size={18} className="text-[#2B6B6D]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-text-primary uppercase tracking-widest">AI Engine Active</div>
              <div className="text-xs text-text-muted">
                Analyzing 14-day rolling window · Next run in{" "}
                <span className="text-[#2B6B6D] font-bold">2h 14m</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-text-muted font-bold tracking-widest uppercase">Model: GPT-4o</div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-none bg-[#787B4E] animate-ping" />
              <span className="text-[11px] text-[#787B4E] font-semibold uppercase tracking-widest">Running</span>
            </div>
          </div>
        </div>

        {/* Insights grid */}
        <div className="space-y-4">
          {aiInsights.map((insight) => {
            const cfg = severityConfig[insight.severity];
            const SeverityIcon = cfg.Icon;

            return (
              <div
                key={insight.id}
                className="bauhaus-card p-5 cursor-pointer transition-transform hover:-translate-y-0.5 group"
                style={{
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  borderLeft: `3px solid ${cfg.color}`
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Severity icon */}
                  <div
                    className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: cfg.tagBg }}
                  >
                    <SeverityIcon size={20} style={{ color: cfg.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                            style={{ background: cfg.tagBg, color: cfg.color }}
                          >
                            {cfg.label}
                          </span>
                          <span className="text-[10px] font-bold text-text-muted px-2 py-0.5 rounded-sm uppercase tracking-widest"
                            style={{ background: "var(--surface-2)" }}>
                            {insight.category}
                          </span>
                          {insight.affectedTeam && (
                            <span className="text-[10px] text-[#2B6B6D] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest"
                              style={{ background: "rgba(43,107,109,0.1)" }}>
                              {insight.affectedTeam}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-text-primary">{insight.title}</h3>
                      </div>
                      {/* Confidence badge */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold" style={{ color: cfg.color }}>
                          {insight.confidence}%
                        </div>
                        <div className="text-[10px] text-text-muted uppercase tracking-widest">confidence</div>
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary leading-relaxed mb-3">
                      {insight.description}
                    </p>

                    {/* Recommendation */}
                    <div
                      className="flex items-start gap-2 p-3 bauhaus-card mt-4"
                      style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                    >
                      <Brain size={14} style={{ color: cfg.color }} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">
                          AI Recommendation
                        </div>
                        <p className="text-xs text-text-primary font-medium">{insight.recommendation}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-[10px] text-text-muted">
                        <Clock size={11} />
                        {insight.createdAt}
                      </div>
                      <button
                        className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest transition-colors"
                        style={{ color: cfg.color }}
                      >
                        Take action <ArrowRight size={11} strokeWidth={3} />
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
