"use client";

import { TopNav } from "../../components/TopNav";
import {
  Brain,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Sparkles,
  ArrowRight,
  Clock,
  Loader2,
  ChevronDown,
  RefreshCw,
  GitBranch,
  ExternalLink,
  Zap,
  TrendingUp,
  Shield,
  Activity,
  CheckSquare,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";

/* ─── Severity config (luxury palette) ─────────────────────── */
const severityConfig = {
  info: {
    Icon: Info,
    color: "var(--severity-info)",
    colorRaw: "#2C7873",
    bg: "rgba(44,120,115,0.06)",
    border: "rgba(44,120,115,0.25)",
    tagBg: "rgba(44,120,115,0.12)",
    badge: "badge-info",
    label: "Info",
    cardClass: "insight-card-info",
  },
  warning: {
    Icon: AlertTriangle,
    color: "var(--severity-warning)",
    colorRaw: "#B8752E",
    bg: "rgba(184,117,46,0.06)",
    border: "rgba(184,117,46,0.25)",
    tagBg: "rgba(184,117,46,0.12)",
    badge: "badge-warning",
    label: "Warning",
    cardClass: "insight-card-warning",
  },
  critical: {
    Icon: XCircle,
    color: "var(--severity-critical)",
    colorRaw: "#A62035",
    bg: "rgba(166,32,53,0.06)",
    border: "rgba(166,32,53,0.25)",
    tagBg: "rgba(166,32,53,0.12)",
    badge: "badge-critical",
    label: "Critical",
    cardClass: "insight-card-critical",
  },
  success: {
    Icon: CheckCircle,
    color: "var(--severity-success)",
    colorRaw: "#4A7C59",
    bg: "rgba(74,124,89,0.06)",
    border: "rgba(74,124,89,0.25)",
    tagBg: "rgba(74,124,89,0.12)",
    badge: "badge-success",
    label: "Positive",
    cardClass: "insight-card-success",
  },
};

/* ─── Confidence ring ───────────────────────────────────────── */
function ConfidenceRing({ value, color }: { value: number; color: string }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} fill="none" stroke="var(--surface-3)" strokeWidth="4" />
        <circle
          cx="26" cy="26" r={r} fill="none"
          stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          transform="rotate(-90 26 26)"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
        <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>
          {value}%
        </text>
      </svg>
      <span style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        conf.
      </span>
    </div>
  );
}

/* ─── Stat card ─────────────────────────────────────────────── */
function StatCard({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: any }) {
  return (
    <div className="editorial-card flex flex-col gap-4 p-5" style={{ borderTop: `2px solid ${color}` }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>{label}</span>
        <Icon size={14} style={{ color }} />
      </div>
      <div className="font-serif text-4xl font-bold" style={{ color, letterSpacing: "-0.03em" }}>{value}</div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────── */
export default function IntelligencePage() {
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const [actionMode, setActionMode] = useState<"refactor" | "issue" | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [userId, setUserId] = useState<string | null>(null);
  const [repos, setRepos] = useState<{ id: string; name: string }[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [issueResult, setIssueResult] = useState<{ url: string } | null>(null);
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;
    api.integrations.getGithubStatus(userId).then((d) => {
      if (d?.repos) setRepos(d.repos.map((r: any) => ({ id: r.id, name: r.name })));
    });
  }, [userId]);

  /* ── queries ── */
  const { data: aiInsights, isLoading } = useQuery({
    queryKey: ["allInsights"],
    queryFn: api.insights.getAll,
  });

  /* ── mutations ── */
  const generateMutation = useMutation({
    mutationFn: api.insights.generate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allInsights"] });
      queryClient.invalidateQueries({ queryKey: ["quickInsights"] });
    },
  });

  const refactorMutation = useMutation({
    mutationFn: (insightId: string) => api.actions.suggestRefactor(insightId),
  });

  const issueMutation = useMutation({
    mutationFn: ({ insightId, repoId, title, body }: { insightId: string; repoId: string; title: string; body: string }) =>
      api.actions.createIssue(userId!, repoId, title, body),
    onSuccess: (data) => {
      setIssueResult({ url: data.url });
    },
  });

  /* ── handlers ── */
  const handleTakeAction = (insightId: string, mode: "refactor" | "issue") => {
    if (activeInsight === insightId && actionMode === mode) {
      setActiveInsight(null);
      setActionMode(null);
      setIssueResult(null);
      return;
    }
    setActiveInsight(insightId);
    setActionMode(mode);
    setIssueResult(null);
    if (mode === "refactor") {
      refactorMutation.reset();
      refactorMutation.mutate(insightId);
    }
  };

  const handleCreateIssue = (insight: any) => {
    if (!userId || !selectedRepo) return;
    issueMutation.mutate({
      insightId: insight.id,
      repoId: selectedRepo,
      title: `[DevMetrics] ${insight.title}`,
      body: `## AI-Detected Issue\n\n**Severity:** ${insight.severity}\n**Category:** ${insight.category}\n\n### Description\n${insight.description}\n\n### Recommended Action\n${insight.recommendation}\n\n---\n*Generated by DevMetrics AI Intelligence Engine · ${new Date().toLocaleDateString()}*`,
    });
  };

  /* ── loading ── */
  if (isLoading || !aiInsights) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopNav title="AI Intelligence" subtitle="Real-time engineering analysis" />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--accent-maroon-dim)", border: "1px solid var(--accent-maroon)" }}>
              <Brain size={22} style={{ color: "var(--accent-maroon-light)" }} />
            </div>
            <Loader2 className="animate-spin" size={18} style={{ color: "var(--text-muted)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading intelligence engine…</p>
          </div>
        </main>
      </div>
    );
  }

  /* ── derived ── */
  const criticalCount = aiInsights.filter((i) => i.severity === "critical").length;
  const warningCount = aiInsights.filter((i) => i.severity === "warning").length;
  const positiveCount = aiInsights.filter((i) => i.severity === "success").length;
  const infoCount = aiInsights.filter((i) => i.severity === "info").length;

  const filtered = filter === "all" ? aiInsights : aiInsights.filter((i) => i.severity === filter);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg)" }}>
      <TopNav title="AI Intelligence" subtitle="Real-time engineering analysis powered by your data" />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">

        {/* ── Hero stats row ────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Insights" value={aiInsights.length} color="var(--text-secondary)" icon={Brain} />
          <StatCard label="Critical" value={criticalCount} color="var(--severity-critical)" icon={XCircle} />
          <StatCard label="Warnings" value={warningCount} color="var(--severity-warning)" icon={AlertTriangle} />
          <StatCard label="Positive" value={positiveCount} color="var(--severity-success)" icon={CheckCircle} />
        </div>

        {/* ── Engine status + Run Analysis ─────────────────── */}
        <div className="editorial-card p-5 flex items-center justify-between gap-6"
          style={{ borderLeft: "3px solid var(--accent-maroon)" }}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: "var(--accent-maroon-dim)", border: "1px solid var(--accent-maroon)" }}>
              <Sparkles size={18} style={{ color: "var(--accent-maroon-light)" }} />
            </div>
            <div>
              <div className="font-serif font-bold text-sm" style={{ color: "var(--text-primary)", letterSpacing: "0.02em" }}>
                AI Intelligence Engine
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {generateMutation.isPending
                  ? "Analyzing repositories & computing insights…"
                  : generateMutation.isSuccess
                  ? `Analysis complete · ${generateMutation.data?.count ?? 0} insights generated`
                  : generateMutation.isError
                  ? "Analysis failed — check OpenAI key in API .env"
                  : "Reads live database aggregations — no mock data"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <Activity size={12} />
              <span className="font-mono uppercase tracking-widest">GPT-4o</span>
            </div>
            <div className="h-4 w-px" style={{ background: "var(--border)" }} />
            <button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              className="btn-primary flex items-center gap-2"
              style={{ fontSize: "11px" }}
            >
              {generateMutation.isPending
                ? <><Loader2 size={13} className="animate-spin" /> Analyzing…</>
                : <><RefreshCw size={13} /> Run Analysis</>}
            </button>
          </div>
        </div>

        {/* ── Filter bar ───────────────────────────────────── */}
        <div className="flex items-center gap-2">
          {[
            { key: "all", label: `All (${aiInsights.length})` },
            { key: "critical", label: `Critical (${criticalCount})` },
            { key: "warning", label: `Warnings (${warningCount})` },
            { key: "success", label: `Positive (${positiveCount})` },
            { key: "info", label: `Info (${infoCount})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm transition-all"
              style={{
                background: filter === key ? "var(--accent-maroon)" : "var(--surface-2)",
                color: filter === key ? "var(--text-primary)" : "var(--text-muted)",
                border: `1px solid ${filter === key ? "var(--accent-maroon)" : "var(--border)"}`,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Empty state ───────────────────────────────────── */}
        {filtered.length === 0 && (
          <div className="editorial-card p-16 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <Brain size={28} style={{ color: "var(--text-muted)" }} />
            </div>
            <div>
              <p className="font-serif text-xl" style={{ color: "var(--text-primary)" }}>No insights yet</p>
              <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
                Click <strong style={{ color: "var(--accent-maroon-light)" }}>Run Analysis</strong> to generate AI insights from your real repository data.
              </p>
            </div>
            <button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending} className="btn-primary">
              {generateMutation.isPending ? <><Loader2 size={14} className="animate-spin" /> Analyzing…</> : <><Sparkles size={14} /> Generate First Insights</>}
            </button>
          </div>
        )}

        {/* ── Insights list ─────────────────────────────────── */}
        <div className="space-y-4">
          {filtered.map((insight, idx) => {
            const cfg = severityConfig[insight.severity as keyof typeof severityConfig] ?? severityConfig.info;
            const SeverityIcon = cfg.Icon;
            const isActive = activeInsight === insight.id;

            return (
              <div
                key={insight.id}
                className={`editorial-card overflow-hidden animate-fade-in-up ${cfg.cardClass}`}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: cfg.tagBg, border: `1px solid ${cfg.border}` }}>
                    <SeverityIcon size={18} style={{ color: cfg.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Tags row */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className={cfg.badge}>{cfg.label}</span>
                      <span className="badge-gold">{insight.category}</span>
                      {insight.affectedTeam && (
                        <span className="badge-info">{insight.affectedTeam}</span>
                      )}
                    </div>

                    {/* Title row */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="font-serif text-lg font-bold leading-snug" style={{ color: "var(--text-primary)" }}>
                        {insight.title}
                      </h3>
                      <ConfidenceRing value={insight.confidence} color={cfg.colorRaw} />
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                      {insight.description}
                    </p>

                    {/* AI Recommendation box */}
                    <div className="rounded-lg p-4 mb-4 flex items-start gap-3"
                      style={{ background: "var(--surface-2)", border: `1px solid ${cfg.border}` }}>
                      <Brain size={14} style={{ color: cfg.color, marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5" style={{ color: "var(--text-muted)" }}>
                          AI Recommendation
                        </div>
                        <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--text-primary)" }}>
                          {insight.recommendation}
                        </p>
                      </div>
                    </div>

                    {/* Footer: timestamp + action buttons */}
                    <div className="flex items-center justify-between pt-1 gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                        <Clock size={11} />
                        {new Date(insight.createdAt).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Generate refactor plan */}
                        <button
                          onClick={() => handleTakeAction(insight.id, "refactor")}
                          className="btn-ghost flex items-center gap-1.5"
                        >
                          <Zap size={12} />
                          {isActive && actionMode === "refactor" ? "Close Plan" : "Refactor Plan"}
                        </button>
                        {/* Create GitHub issue */}
                        {userId && (
                          <button
                            onClick={() => handleTakeAction(insight.id, "issue")}
                            className="btn-ghost flex items-center gap-1.5"
                          >
                            <GitBranch size={12} />
                            {isActive && actionMode === "issue" ? "Close" : "Create Issue"}
                          </button>
                        )}
                        {/* Mark resolved (placeholder for future) */}
                        <button
                          className="btn-ghost flex items-center gap-1.5"
                          style={{ opacity: 0.5, cursor: "not-allowed" }}
                          title="Coming soon"
                        >
                          <CheckSquare size={12} />
                          Resolve
                        </button>
                      </div>
                    </div>

                    {/* ── Action panel ─────────────────────── */}
                    {isActive && (
                      <div className="mt-5 pt-5 animate-slide-down" style={{ borderTop: "1px solid var(--border)" }}>

                        {/* Refactor plan */}
                        {actionMode === "refactor" && (
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <TrendingUp size={14} style={{ color: cfg.color }} />
                              <h4 className="text-xs font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-primary)" }}>
                                AI-Generated Refactor Plan
                              </h4>
                            </div>
                            {refactorMutation.isPending && (
                              <div className="flex items-center gap-3 text-sm p-4 rounded-lg" style={{ background: "var(--surface-2)" }}>
                                <Loader2 size={16} className="animate-spin" style={{ color: cfg.color }} />
                                <span style={{ color: "var(--text-secondary)" }}>GPT-4o is generating your step-by-step plan…</span>
                              </div>
                            )}
                            {refactorMutation.isError && (
                              <div className="p-4 rounded-lg text-sm" style={{ background: "rgba(166,32,53,0.08)", border: "1px solid rgba(166,32,53,0.25)", color: "#E8929F" }}>
                                Failed to generate plan. Ensure your OpenAI API key is valid in <code className="font-mono text-xs">apps/api/.env</code>.
                              </div>
                            )}
                            {refactorMutation.isSuccess && (
                              <div className="code-block">
                                {refactorMutation.data.suggestion}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Create GitHub issue */}
                        {actionMode === "issue" && (
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <GitBranch size={14} style={{ color: cfg.color }} />
                              <h4 className="text-xs font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-primary)" }}>
                                Create GitHub Issue
                              </h4>
                            </div>

                            {issueResult ? (
                              <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: "rgba(74,124,89,0.08)", border: "1px solid rgba(74,124,89,0.25)" }}>
                                <CheckCircle size={16} style={{ color: "var(--severity-success)" }} />
                                <div>
                                  <p className="text-sm font-semibold" style={{ color: "#82C49A" }}>Issue created successfully!</p>
                                  <a href={issueResult.url} target="_blank" rel="noopener noreferrer"
                                    className="text-xs font-mono flex items-center gap-1 mt-1 hover:underline"
                                    style={{ color: "var(--text-secondary)" }}>
                                    {issueResult.url} <ExternalLink size={10} />
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="p-4 rounded-lg" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Issue title preview</p>
                                  <p className="text-sm font-mono" style={{ color: "var(--text-primary)" }}>
                                    [DevMetrics] {insight.title}
                                  </p>
                                </div>

                                {repos.length > 0 ? (
                                  <>
                                    <select
                                      value={selectedRepo}
                                      onChange={(e) => setSelectedRepo(e.target.value)}
                                      className="w-full text-sm px-3 py-2 rounded-lg appearance-none"
                                      style={{
                                        background: "var(--surface-3)",
                                        border: "1px solid var(--border-bright)",
                                        color: selectedRepo ? "var(--text-primary)" : "var(--text-muted)",
                                        outline: "none",
                                      }}
                                    >
                                      <option value="" disabled>Select repository to create issue in…</option>
                                      {repos.map((r) => (
                                        <option key={r.id} value={r.id} style={{ background: "var(--surface-3)" }}>{r.name}</option>
                                      ))}
                                    </select>
                                    <button
                                      onClick={() => handleCreateIssue(insight)}
                                      disabled={!selectedRepo || issueMutation.isPending}
                                      className="btn-primary w-full justify-center"
                                    >
                                      {issueMutation.isPending
                                        ? <><Loader2 size={13} className="animate-spin" /> Creating issue…</>
                                        : <><GitBranch size={13} /> Push to GitHub Issues</>}
                                    </button>
                                    {issueMutation.isError && (
                                      <p className="text-xs" style={{ color: "var(--severity-critical)" }}>
                                        Failed to create issue. Check your GitHub integration.
                                      </p>
                                    )}
                                  </>
                                ) : (
                                  <div className="text-sm p-4 rounded-lg" style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}>
                                    No repositories found. Connect GitHub in{" "}
                                    <a href="/integrations" className="underline" style={{ color: "var(--accent-maroon-light)" }}>Integrations</a>.
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
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
