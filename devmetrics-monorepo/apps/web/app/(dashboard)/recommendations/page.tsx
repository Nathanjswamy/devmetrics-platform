"use client";

import { TopNav } from "../../components/TopNav";
import { AlertTriangle, CheckCircle, ArrowRight, Loader2, Target, Zap, Sparkles, GitBranch } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../../lib/api";
import Link from "next/link";

export default function RecommendationsPage() {
  const { data: aiInsights, isLoading } = useQuery({
    queryKey: ["allInsights"],
    queryFn: api.insights.getAll,
  });

  const generateMutation = useMutation({
    mutationFn: api.insights.generate,
  });

  if (isLoading || !aiInsights) {
    return (
      <div className="flex flex-col min-h-screen" style={{ background: "var(--bg)" }}>
        <TopNav title="Recommendations" subtitle="Highest-impact actions ranked by AI" />
        <main className="flex-1 p-8 flex items-center justify-center">
          <Loader2 className="animate-spin" size={20} style={{ color: "var(--text-muted)" }} />
        </main>
      </div>
    );
  }

  const actions = [...aiInsights]
    .filter((i) => i.severity === "critical" || i.severity === "warning")
    .sort((a) => (a.severity === "critical" ? -1 : 1));

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg)" }}>
      <TopNav title="Recommendations" subtitle="Highest-impact actions ranked by AI" />

      <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h2 className="font-serif text-2xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              Top Priorities
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Derived from real-time analysis of your repository activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            >
              <Target size={13} style={{ color: "var(--accent-maroon-light)" }} />
              {actions.length} action{actions.length !== 1 && "s"}
            </div>
            <Link
              href="/intelligence"
              className="btn-primary text-xs"
            >
              <Sparkles size={13} /> Run AI Analysis
            </Link>
          </div>
        </div>

        {/* Empty state */}
        {actions.length === 0 ? (
          <div className="editorial-card p-16 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <CheckCircle size={28} style={{ color: "var(--severity-success)" }} />
            </div>
            <div>
              <h3 className="font-serif text-xl" style={{ color: "var(--text-primary)" }}>All caught up!</h3>
              <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
                No critical or warning-level issues found. Your codebase looks healthy.
              </p>
            </div>
            <button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              className="btn-ghost"
            >
              {generateMutation.isPending ? <><Loader2 size={13} className="animate-spin" /> Analyzing…</> : "Refresh Analysis"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {actions.map((action, index) => {
              const isCritical = action.severity === "critical";
              const accentColor = isCritical ? "var(--severity-critical)" : "var(--severity-warning)";
              const accentBg = isCritical ? "rgba(166,32,53,0.08)" : "rgba(184,117,46,0.08)";
              const accentBorder = isCritical ? "rgba(166,32,53,0.25)" : "rgba(184,117,46,0.25)";

              return (
                <div
                  key={action.id}
                  className="editorial-card overflow-hidden animate-fade-in-up"
                  style={{
                    borderLeft: `3px solid ${accentColor}`,
                    background: accentBg,
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-start gap-5">
                    {/* Rank number */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className="w-9 h-9 rounded-md flex items-center justify-center font-serif text-base font-bold"
                        style={{ background: "var(--surface-3)", border: `1px solid ${accentBorder}`, color: accentColor }}
                      >
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Tags */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-sm"
                          style={{ background: accentBg, border: `1px solid ${accentBorder}`, color: accentColor }}
                        >
                          {isCritical ? "Critical" : "Warning"}
                        </span>
                        <span className="badge-gold">{action.category}</span>
                        {action.affectedTeam && (
                          <span className="badge-info">{action.affectedTeam}</span>
                        )}
                      </div>

                      <h3 className="font-serif text-lg font-bold mb-3 leading-snug" style={{ color: "var(--text-primary)" }}>
                        {action.title}
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle size={13} style={{ color: "var(--text-muted)", marginTop: 2, flexShrink: 0 }} />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest block mb-1" style={{ color: "var(--text-muted)" }}>
                              The Problem
                            </span>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                              {action.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Zap size={13} style={{ color: accentColor, marginTop: 2, flexShrink: 0 }} />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest block mb-1" style={{ color: "var(--text-muted)" }}>
                              Recommended Action
                            </span>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                              {action.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-5">
                        <Link href="/intelligence" className="btn-ghost text-xs flex items-center gap-1.5">
                          <ArrowRight size={11} /> View in Intelligence
                        </Link>
                        <span
                          className="text-[10px] font-bold uppercase tracking-widest"
                          style={{ color: accentColor }}
                        >
                          {action.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
