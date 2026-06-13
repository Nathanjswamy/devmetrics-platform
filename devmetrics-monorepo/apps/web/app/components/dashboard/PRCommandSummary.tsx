"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { Loader2, GitPullRequest, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function PRRow({ pr, accent }: { pr: any; accent: string }) {
  const age = pr.age ?? `${Math.round(pr.ageHours)}h`;
  return (
    <div
      className="flex items-center gap-4 py-3"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
          {pr.title}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            {pr.repo}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            by {pr.author}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs flex-shrink-0 font-mono" style={{ color: accent }}>
        <Clock size={10} />
        {age}
      </div>
    </div>
  );
}

export function PRCommandSummary() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["prCommandCenter"],
    queryFn: api.prs.getCommandCenter,
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="editorial-card h-64 flex items-center justify-center">
        <Loader2 className="animate-spin" size={20} style={{ color: "var(--text-muted)" }} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="editorial-card h-64 flex flex-col items-center justify-center gap-3 text-center p-6">
        <GitPullRequest size={28} style={{ color: "var(--text-muted)", opacity: 0.4 }} />
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Unable to load PR data</p>
      </div>
    );
  }

  const totalPRs = data.fresh.length + data.aging.length + data.stale.length;

  return (
    <div className="editorial-card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="editorial-header text-base">PR Command Center</h2>
          <div className="text-xs mt-0.5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            {totalPRs} open pull request{totalPRs !== 1 ? "s" : ""}
          </div>
        </div>
        <Link href="/reviews"
          className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 transition-colors"
          style={{ color: "var(--accent-maroon-light)" }}>
          View all →
        </Link>
      </div>

      {/* Summary stat row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Fresh", count: data.fresh.length, color: "var(--severity-success)", icon: CheckCircle2 },
          { label: "Aging", count: data.aging.length, color: "var(--severity-warning)", icon: Clock },
          { label: "Stale", count: data.stale.length, color: "var(--severity-critical)", icon: AlertCircle },
        ].map(({ label, count, color, icon: Icon }) => (
          <div key={label} className="rounded-lg p-3 text-center"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <Icon size={14} style={{ color, margin: "0 auto 4px" }} />
            <div className="font-serif text-2xl font-bold" style={{ color }}>{count}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* PR rows — stale first (most urgent) */}
      <div className="flex-1 overflow-y-auto space-y-0" style={{ maxHeight: "260px" }}>
        {data.stale.slice(0, 3).map((pr) => (
          <PRRow key={pr.id} pr={pr} accent="var(--severity-critical)" />
        ))}
        {data.aging.slice(0, 3).map((pr) => (
          <PRRow key={pr.id} pr={pr} accent="var(--severity-warning)" />
        ))}
        {data.fresh.slice(0, 2).map((pr) => (
          <PRRow key={pr.id} pr={pr} accent="var(--severity-success)" />
        ))}
        {totalPRs === 0 && (
          <div className="py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            No open pull requests found.
          </div>
        )}
      </div>
    </div>
  );
}
