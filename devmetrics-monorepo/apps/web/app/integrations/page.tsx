"use client";
import { TopNav } from "../components/TopNav";
import { Zap, GitPullRequest, GitMerge, CheckCircle, Plus } from "lucide-react";

const integrations = [
  { name: "GitHub", desc: "Sync PRs, commits, and deployments", icon: GitPullRequest, color: "#2B6B6D", connected: true, stats: "3 repos synced" },
  { name: "GitLab", desc: "Pipelines, MRs, and CI/CD events", icon: GitMerge, color: "#DE7A35", connected: false, stats: null },
  { name: "Jira", desc: "Sprint planning and issue tracking", icon: Zap, color: "#53798C", connected: true, stats: "6 active sprints" },
  { name: "Linear", desc: "Issue tracking and roadmaps", icon: Zap, color: "#787B4E", connected: false, stats: null },
  { name: "Slack", desc: "Alert notifications and digests", icon: Zap, color: "#D05A44", connected: true, stats: "#engineering channel" },
  { name: "PagerDuty", desc: "Incident management and on-call", icon: Zap, color: "#D4AF37", connected: false, stats: null },
];

export default function IntegrationsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="Integrations" subtitle="Connect your tools to DevMetrics" />
      <main className="flex-1 p-6">
        <div className="grid grid-cols-3 gap-4">
          {integrations.map((int) => {
            const Icon = int.icon;
            const cardContent = (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-sm flex items-center justify-center transform -rotate-3"
                      style={{ background: `${int.color}18`, border: `2px solid ${int.color}40` }}>
                      <Icon size={20} style={{ color: int.color }} className="rotate-3" />
                    </div>
                    {int.name === 'GitHub' ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-surface-3"
                        style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                        Manage
                      </span>
                    ) : int.connected ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-widest"
                        style={{ background: "rgba(120,123,78,0.1)", color: "#787B4E", border: "1px solid rgba(120,123,78,0.3)" }}>
                        <CheckCircle size={11} strokeWidth={3} /> Connected
                      </div>
                    ) : (
                      <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-surface-3"
                        style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                        <Plus size={11} /> Connect
                      </button>
                    )}
                  </div>
                  <div className="font-semibold text-text-primary mb-1">{int.name}</div>
                  <div className="text-xs text-text-muted mb-2">{int.desc}</div>
                  {int.stats && <div className="text-[11px] font-medium" style={{ color: int.color }}>{int.stats}</div>}
                </>
              );

              if (int.name === 'GitHub') {
                return (
                  <a key={int.name} href="/integrations/github" className="bauhaus-card p-5 transition-transform hover:-translate-y-0.5 cursor-pointer block no-underline text-inherit">
                    {cardContent}
                  </a>
                );
              }

              return (
                <div key={int.name} className="bauhaus-card p-5 transition-transform hover:-translate-y-0.5 cursor-pointer">
                  {cardContent}
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
}
