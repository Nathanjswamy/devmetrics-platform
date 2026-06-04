"use client";

import { TopNav } from "../../components/TopNav";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { PullRequest } from "../../types";
import { GitPullRequest, Plus, Minus, Users, Clock, Tag, Loader2 } from "lucide-react";

const columnConfig = {
  fresh: {
    label: "Fresh",
    subtitle: "< 24 hours",
    color: "var(--text-primary)",
    bg: "var(--surface)",
    border: "var(--border)",
    headerBg: "var(--surface-2)",
    dot: "#7A8B6F", // Sage Green
  },
  aging: {
    label: "Aging",
    subtitle: "24 – 72 hours",
    color: "var(--text-primary)",
    bg: "var(--surface)",
    border: "var(--border)",
    headerBg: "var(--surface-2)",
    dot: "#C86A3D", // Burnt Orange
  },
  stale: {
    label: "Stale",
    subtitle: "> 72 hours",
    color: "var(--text-primary)",
    bg: "var(--surface)",
    border: "var(--border)",
    headerBg: "var(--surface-2)",
    dot: "#0F172A", // Navy
  },
};

function AvatarBadge({ initials, size = 28 }: { initials?: string; size?: number }) {
  const safeInitials = initials || "?";
  if (safeInitials.startsWith("http")) {
    return (
      <div
        className="rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 border border-border"
        style={{ width: size, height: size }}
      >
        <img src={safeInitials} alt="Avatar" className="w-full h-full object-cover" />
      </div>
    );
  }
  const colors = ["#53798C", "#787B4E", "#DE7A35", "#2B6B6D", "#D4AF37"];
  const color = colors[safeInitials.charCodeAt(0) % colors.length];
  return (
    <div
      className="rounded-full flex items-center justify-center text-[10px] font-serif font-bold text-text-primary border border-border bg-surface flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {safeInitials}
    </div>
  );
}

function PRCard({ pr }: { pr: PullRequest }) {
  const cfg = columnConfig[pr.status];
  const labelColors: Record<string, string> = {
    feature: "#2B6B6D", // Teal
    bug: "#D05A44", // Terracotta
    critical: "#D05A44", // Terracotta
    refactor: "#53798C", // Blue
    infra: "#787B4E", // Olive
    deps: "#D4AF37", // Gold
    database: "#DE7A35", // Orange
    realtime: "#2B6B6D",
    docs: "#787B4E",
    ai: "#53798C",
  };

  return (
    <div className="editorial-card p-4 transition-all hover:bg-surface-2 cursor-pointer group">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <AvatarBadge initials={pr.authorAvatar} />
        <div className="flex-1 min-w-0">
          <div className="text-xs text-text-secondary mb-1">{pr.author}</div>
          <div className="text-sm font-semibold text-text-primary line-clamp-2 leading-snug group-hover:text-text-secondary transition-colors">
            {pr.title}
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-1 mb-3">
        {pr.labels.map((label) => (
          <span
            key={label}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-widest bg-surface-2 text-text-secondary border border-border"
          >
            <Tag size={10} />
            {label}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="font-mono text-text-primary font-medium truncate max-w-[90px]">{pr.repo}</span>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            {pr.age}
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} />
            {pr.reviewers}
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-semibold font-mono">
          <span className="flex items-center gap-0.5 text-emerald-400">
            <Plus size={10} />
            {pr.additions}
          </span>
          <span className="flex items-center gap-0.5 text-rose-400">
            <Minus size={10} />
            {pr.deletions}
          </span>
        </div>
      </div>

      {/* Age urgency bar */}
      <div className="mt-4 h-[2px] w-full" style={{ background: "var(--border)" }}>
        <div
          className="h-full transition-all duration-1000"
          style={{
            width: `${Math.min((pr.ageHours / 96) * 100, 100)}%`,
            background: cfg.dot,
          }}
        />
      </div>
    </div>
  );
}

export default function CodeReviewPage() {
  const { data: prs, isLoading } = useQuery({
    queryKey: ["prsCommandCenter"],
    queryFn: api.prs.getCommandCenter,
  });

  if (isLoading || !prs) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopNav title="Code Review Command Center" subtitle="Visual PR freshness tracking with aging alerts" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="animate-spin text-text-muted" />
        </main>
      </div>
    );
  }

  const fresh = prs.fresh;
  const aging = prs.aging;
  const stale = prs.stale;

  const columns: Array<{ key: "fresh" | "aging" | "stale"; prs: PullRequest[] }> = [
    { key: "fresh", prs: fresh },
    { key: "aging", prs: aging },
    { key: "stale", prs: stale },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        title="Code Review Command Center"
        subtitle="Visual PR freshness tracking with aging alerts"
      />

      <main className="flex-1 p-6">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {columns.map(({ key, prs }) => {
            const cfg = columnConfig[key];
            return (
              <div
                key={key}
                className="flex items-center gap-3 editorial-card p-4"
                style={{ background: cfg.headerBg }}
              >
                <div className="w-3 h-3 rounded-full" style={{ background: cfg.dot }} />
                <div className="font-serif font-bold text-lg text-text-primary">
                  {cfg.label}
                </div>
                <div className="text-text-secondary text-sm">{cfg.subtitle}</div>
                <div
                  className="ml-auto text-2xl font-serif"
                  style={{ color: cfg.color }}
                >
                  {prs.length}
                </div>
              </div>
            );
          })}
        </div>

        {/* Kanban columns */}
        <div className="grid grid-cols-3 gap-5">
          {columns.map(({ key, prs }) => {
            const cfg = columnConfig[key];
            return (
              <div key={key} className="flex flex-col gap-3">
                {/* Column header */}
                <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
                  <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                    {cfg.label}
                  </span>
                  <span
                    className="ml-auto text-xs font-serif font-bold text-text-primary"
                  >
                    {prs.length}
                  </span>
                </div>

                {/* PR cards */}
                {prs.length > 0 ? (
                  prs.map((pr) => <PRCard key={pr.id} pr={pr} />)
                ) : (
                  <div
                    className="rounded-xl p-8 flex flex-col items-center justify-center text-center"
                    style={{ border: "2px dashed var(--border)" }}
                  >
                    <GitPullRequest size={24} className="text-text-muted mb-2" />
                    <span className="text-xs text-text-muted">No {cfg.label.toLowerCase()} PRs</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
