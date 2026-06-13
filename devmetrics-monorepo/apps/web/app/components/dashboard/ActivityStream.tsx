"use client";

import { Rocket, GitMerge, AlertCircle, Star, Zap, Bell, Loader2, GitCommit } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

const eventConfig = {
  deploy: {
    Icon: Rocket,
    color: "var(--warning)",
    bg: "rgba(201,169,110,0.12)",
    label: "Deploy",
  },
  pr_merged: {
    Icon: GitMerge,
    color: "var(--success)",
    bg: "rgba(74,124,89,0.12)",
    label: "Merged",
  },
  incident: {
    Icon: AlertCircle,
    color: "var(--danger)",
    bg: "rgba(166,32,53,0.12)",
    label: "Incident",
  },
  review: {
    Icon: Star,
    color: "var(--success)",
    bg: "rgba(58,155,149,0.12)",
    label: "Review",
  },
  commit: {
    Icon: GitCommit,
    color: "var(--text-secondary)",
    bg: "rgba(168,148,144,0.1)",
    label: "Commit",
  },
  alert: {
    Icon: Bell,
    color: "var(--warning)",
    bg: "rgba(184,117,46,0.12)",
    label: "Alert",
  },
};

function AvatarBadge({ initials }: { initials?: string }) {
  const s = initials || "?";
  if (s.startsWith("http")) {
    return (
      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0" style={{ border: "1px solid var(--border)" }}>
        <img src={s} alt="Avatar" className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-sans font-bold flex-shrink-0"
      style={{ background: "var(--surface-3)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
      {s.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function ActivityStream() {
  const { data: activityEvents, isLoading } = useQuery({
    queryKey: ["activityStream"],
    queryFn: api.activity.getLiveStream,
    refetchInterval: 8000,
  });

  if (isLoading || !activityEvents) {
    return (
      <div className="editorial-card h-full flex flex-col gap-4 p-6">
        <div className="skeleton h-5 w-36" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="skeleton w-7 h-7 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-2 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="editorial-card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="editorial-header text-base">Live Activity</h2>
          <div className="text-[11px] mt-1 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Team operations feed
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="status-dot-green" />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Live</span>
        </div>
      </div>

      {/* Events */}
      <div className="flex-1 overflow-y-auto space-y-0" style={{ maxHeight: "400px" }}>
        {activityEvents.length === 0 && (
          <div className="py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            No activity yet. Push commits or open PRs to see events.
          </div>
        )}
        {activityEvents.map((event) => {
          const cfg = eventConfig[event.type] ?? eventConfig.commit;
          const EventIcon = cfg.Icon;
          return (
            <div
              key={event.id}
              className="flex items-start gap-3 py-3 animate-fade-in-up"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <AvatarBadge initials={event.actorAvatar} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: cfg.bg }}>
                    <EventIcon size={10} style={{ color: cfg.color }} />
                  </div>
                  <p className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>
                    <span className="font-semibold mr-1" style={{ color: "var(--text-primary)" }}>{event.actor}</span>
                    {event.message}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-1.5 ml-7">
                  {event.repo && (
                    <span className="text-[10px] font-mono" style={{ color: "var(--success)" }}>
                      {event.repo}
                    </span>
                  )}
                  <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                    {event.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
