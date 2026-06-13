"use client";
import { TopNav } from "../../components/TopNav";
import { Zap, GitPullRequest, GitMerge, CheckCircle, Plus } from "lucide-react";

const integrations = [
  { name: "GitHub", desc: "Sync PRs, commits, and deployments", icon: GitPullRequest, connected: true, stats: "3 repos synced" },
  { name: "GitLab", desc: "Pipelines, MRs, and CI/CD events", icon: GitMerge, connected: false, stats: null },
  { name: "Jira", desc: "Sprint planning and issue tracking", icon: Zap, connected: true, stats: "6 active sprints" },
  { name: "Linear", desc: "Issue tracking and roadmaps", icon: Zap, connected: false, stats: null },
  { name: "Slack", desc: "Alert notifications and digests", icon: Zap, connected: true, stats: "#engineering channel" },
  { name: "PagerDuty", desc: "Incident management and on-call", icon: Zap, connected: false, stats: null },
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
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded bg-surface border border-border flex items-center justify-center">
                      <Icon size={24} className="text-text-primary" />
                    </div>
                    {int.name === 'GitHub' ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-surface-2 bg-surface text-text-primary border border-border">
                        Manage
                      </span>
                    ) : int.connected ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-green">
                        <CheckCircle size={14} strokeWidth={2.5} /> Connected
                      </div>
                    ) : (
                      <button className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-surface-2 bg-surface text-text-secondary border border-border">
                        <Plus size={14} /> Connect
                      </button>
                    )}
                  </div>
                  <div className="font-sans text-lg font-bold text-text-primary mb-1">{int.name}</div>
                  <div className="text-sm text-text-secondary mb-4">{int.desc}</div>
                  {int.stats && <div className="text-xs font-medium text-text-primary font-mono">{int.stats}</div>}
                </>
              );

              if (int.name === 'GitHub') {
                return (
                  <a key={int.name} href="/integrations/github" className="editorial-card p-6 hover:bg-surface-2 transition-colors block no-underline text-inherit">
                    {cardContent}
                  </a>
                );
              }

              return (
                <div key={int.name} className="editorial-card p-6 hover:bg-surface-2 transition-colors">
                  {cardContent}
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
}
