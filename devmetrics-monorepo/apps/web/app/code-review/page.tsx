"use client";

import { TopNav } from "../components/TopNav";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { PullRequest } from "../types";
import { GitPullRequest, Plus, Minus, Users, Clock, Tag, Loader2 } from "lucide-react";

const columnConfig = {
  fresh: {
    label: "Fresh",
    subtitle: "< 24 hours",
    color: "#53798C", // Blue
    bg: "rgba(83,121,140,0.06)",
    border: "rgba(83,121,140,0.15)",
    headerBg: "rgba(83,121,140,0.1)",
    dot: "#53798C",
  },
  aging: {
    label: "Aging",
    subtitle: "24 – 72 hours",
    color: "#DE7A35", // Orange
    bg: "rgba(222,122,53,0.06)",
    border: "rgba(222,122,53,0.2)",
    headerBg: "rgba(222,122,53,0.1)",
    dot: "#DE7A35",
  },
  stale: {
    label: "Stale",
    subtitle: "> 72 hours",
    color: "#D05A44", // Terracotta
    bg: "rgba(208,90,68,0.06)",
    border: "rgba(208,90,68,0.2)",
    headerBg: "rgba(208,90,68,0.1)",
    dot: "#D05A44",
  },
};

function AvatarBadge({ initials, size = 28 }: { initials?: string; size?: number }) {
  const safeInitials = initials || "?";
  const colors = ["#53798C", "#787B4E", "#DE7A35", "#2B6B6D", "#D4AF37"];
  const color = colors[safeInitials.charCodeAt(0) % colors.length];
  return (
    <div
      className="rounded-sm flex items-center justify-center text-[10px] font-bold text-[#F8F6F1] flex-shrink-0"
      style={{ width: size, height: size, background: color }}
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
    <div className="bauhaus-card p-4 cursor-pointer transition-transform hover:-translate-y-0.5 group">
      {/* Header */}
      <div className="flex items-start gap-2.5 mb-3">
        <AvatarBadge initials={pr.authorAvatar} />
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-text-muted mb-0.5">{pr.author}</div>
          <div className="text-sm font-semibold text-text-primary line-clamp-2 leading-tight group-hover:text-[#53798C] transition-colors">
            {pr.title}
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-1 mb-3">
        {pr.labels.map((label) => (
          <span
            key={label}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest"
            style={{
              background: `${labelColors[label] ?? "#8B91B3"}18`,
              border: `1px solid ${labelColors[label] ?? "#8B91B3"}30`,
              color: labelColors[label] ?? "#8B91B3",
            }}
          >
            <Tag size={8} />
            {label}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] text-text-muted">
          <span className="font-mono text-[#53798C] font-bold truncate max-w-[90px]">{pr.repo}</span>
          <div className="flex items-center gap-1">
            <Clock size={10} />
            {pr.age}
          </div>
          <div className="flex items-center gap-1">
            <Users size={10} />
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
      <div className="mt-3 h-1 rounded-none overflow-hidden" style={{ background: "var(--surface-3)" }}>
        <div
          className="h-full rounded-none"
          style={{
            width: `${Math.min((pr.ageHours / 96) * 100, 100)}%`,
            background: cfg.color,
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
                className="flex items-center gap-3 bauhaus-card p-3.5"
                style={{ background: cfg.headerBg }}
              >
                <div className="w-3 h-3 rounded-none" style={{ background: cfg.dot }} />
                <div className="font-semibold text-sm" style={{ color: cfg.color }}>
                  {cfg.label}
                </div>
                <div className="text-text-muted text-xs">{cfg.subtitle}</div>
                <div
                  className="ml-auto text-lg font-bold"
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
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-none" style={{ background: cfg.dot }} />
                  <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: cfg.color }}>
                    {cfg.label}
                  </span>
                  <span
                    className="ml-auto px-2 py-0.5 rounded-sm text-[11px] font-bold"
                    style={{ background: `${cfg.dot}20`, color: cfg.color }}
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
