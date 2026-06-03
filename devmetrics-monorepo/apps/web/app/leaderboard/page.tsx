"use client";

import { TopNav } from "../components/TopNav";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { TrendingUp, TrendingDown, Minus, Trophy, GitPullRequest, Star, Clock, Loader2 } from "lucide-react";

function AvatarBadge({ initials, rank }: { initials?: string; rank: number }) {
  const safeInitials = initials || "?";
  const colors = [
    "#D05A44", // Terracotta
    "#2B6B6D", // Teal
    "#787B4E", // Olive
    "#DE7A35", // Orange
    "#53798C", // Blue
    "#D4AF37", // Gold
  ];
  return (
    <div className="relative">
      <div
        className="w-10 h-10 rounded-sm flex items-center justify-center text-sm font-bold text-[#F8F6F1]"
        style={{ background: colors[(rank - 1) % colors.length] }}
      >
        {safeInitials}
      </div>
      {rank <= 3 && (
        <div
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-none flex items-center justify-center text-[9px] font-bold text-[#F8F6F1]"
          style={{
            background:
              rank === 1 ? "#D4AF37" : rank === 2 ? "#5C584E" : "#DE7A35",
            boxShadow: `2px 2px 0px 0px rgba(44,42,38,0.1)`,
          }}
        >
          {rank}
        </div>
      )}
    </div>
  );
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-none overflow-hidden" style={{ background: "var(--surface-3)" }}>
        <div
          className="h-full rounded-none"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-[11px] font-bold text-text-secondary w-7">{value}</span>
    </div>
  );
}

export default function LeaderboardPage() {
  const { data: developers, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: api.team.getLeaderboard,
  });

  if (isLoading || !developers) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopNav title="Developer Leaderboard" subtitle="Gamified performance tracking by impact & efficiency" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="animate-spin text-text-muted" />
        </main>
      </div>
    );
  }

  const sorted = [...developers].sort(
    (a, b) => (b.velocity + b.impact + b.reliability) / 3 - (a.velocity + a.impact + a.reliability) / 3
  );

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        title="Developer Leaderboard"
        subtitle="Gamified performance tracking by impact & efficiency"
      />

      <main className="flex-1 p-6">
        {/* Podium top 3 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {sorted.slice(0, 3).map((dev, i) => {
            const rank = i + 1;
            const overallScore = Math.round((dev.velocity + dev.impact + dev.reliability) / 3);
            const rankColors = ["#D4AF37", "#5C584E", "#DE7A35"];
            const rankBgs = ["rgba(212,175,55,0.08)", "rgba(92,88,78,0.06)", "rgba(222,122,53,0.06)"];

            return (
              <div
                key={dev.id}
                className="bauhaus-card p-5 transition-transform hover:-translate-y-0.5"
                style={{ background: rankBgs[i], border: `1px solid ${rankColors[i]}40` }}
              >
                {rank === 1 && (
                  <div
                    className="absolute top-0 right-0 w-8 h-8 opacity-20 pointer-events-none"
                    style={{
                      background: rankColors[0],
                      clipPath: "polygon(100% 0, 0 0, 100% 100%)"
                    }}
                  />
                )}
                <div className="flex items-center gap-3 mb-4">
                  <AvatarBadge initials={dev.avatar} rank={rank} />
                  <div>
                    <div className="font-semibold text-text-primary text-sm">{dev.name}</div>
                    <div className="text-xs text-text-muted">{dev.role}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-2xl font-bold" style={{ color: rankColors[i] }}>
                      {overallScore}
                    </div>
                    <div className="text-[10px] text-text-muted">overall</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  {[
                    { label: "PRs", value: dev.prsMerged },
                    { label: "Reviews", value: dev.reviewsGiven },
                    { label: "Commits", value: dev.commitsThisWeek },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg py-2"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <div className="font-bold text-text-primary text-base">{stat.value}</div>
                      <div className="text-text-muted">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Full table */}
        <div className="bauhaus-card overflow-hidden">
          {/* Table header */}
          <div
            className="grid items-center px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-text-muted"
            style={{
              gridTemplateColumns: "48px 1fr 100px 100px 100px 90px 80px 80px 60px",
              borderBottom: "1px solid var(--border)",
              background: "var(--surface-2)",
            }}
          >
            <span>#</span>
            <span>Developer</span>
            <span>Velocity</span>
            <span>Impact</span>
            <span>Reliability</span>
            <span>PRs</span>
            <span>Reviews</span>
            <span>Avg Review</span>
            <span>Trend</span>
          </div>

          {/* Rows */}
          {sorted.map((dev, i) => {
            const rank = i + 1;
            const TrendIcon =
              dev.trend === "up"
                ? TrendingUp
                : dev.trend === "down"
                ? TrendingDown
                : Minus;
            const trendColor =
              dev.trend === "up"
                ? "#787B4E" // Olive
                : dev.trend === "down"
                ? "#D05A44" // Terracotta
                : "var(--text-muted)";

            return (
              <div
                key={dev.id}
                className="grid items-center px-5 py-3.5 transition-all duration-200 cursor-pointer hover:bg-surface-3 group"
                style={{
                  gridTemplateColumns: "48px 1fr 100px 100px 100px 90px 80px 80px 60px",
                  borderBottom: i < sorted.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                {/* Rank */}
                <div>
                  {rank <= 3 ? (
                    <Trophy
                      size={14}
                      style={{
                        color:
                          rank === 1 ? "#D4AF37" : rank === 2 ? "#5C584E" : "#DE7A35",
                      }}
                    />
                  ) : (
                    <span className="text-sm text-text-muted font-mono">{rank}</span>
                  )}
                </div>

                {/* Dev */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-sm flex items-center justify-center text-[10px] font-bold text-text-primary"
                    style={{ background: "var(--surface-3)", border: "1px solid var(--border)" }}
                  >
                    {dev.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary group-hover:text-indigo-300 transition-colors">
                      {dev.name}
                    </div>
                    <div className="text-[10px] text-text-muted">{dev.role}</div>
                  </div>
                </div>

                {/* Scores */}
                <ScoreBar value={dev.velocity} color="#2B6B6D" />
                <ScoreBar value={dev.impact} color="#53798C" />
                <ScoreBar value={dev.reliability} color="#787B4E" />

                {/* Stats */}
                <div className="flex items-center gap-1 text-xs text-text-secondary">
                  <GitPullRequest size={11} />
                  {dev.prsMerged}/{dev.prsOpened}
                </div>
                <div className="flex items-center gap-1 text-xs text-text-secondary">
                  <Star size={11} />
                  {dev.reviewsGiven}
                </div>
                <div className="flex items-center gap-1 text-xs text-text-secondary">
                  <Clock size={11} />
                  {dev.avgReviewTime}
                </div>

                {/* Trend */}
                <TrendIcon size={14} style={{ color: trendColor }} />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
