"use client";

import { Rocket, GitMerge, AlertCircle, Star, Zap, Bell, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

const eventConfig = {
  deploy: { Icon: Rocket, color: "var(--text-primary)", bg: "var(--surface-2)" },
  pr_merged: { Icon: GitMerge, color: "var(--text-primary)", bg: "var(--surface-2)" },
  incident: { Icon: AlertCircle, color: "#C86A3D", bg: "rgba(200,106,61,0.05)" },
  review: { Icon: Star, color: "var(--text-primary)", bg: "var(--surface-2)" },
  commit: { Icon: Zap, color: "var(--text-primary)", bg: "var(--surface-2)" },
  alert: { Icon: Bell, color: "#C86A3D", bg: "rgba(200,106,61,0.05)" },
};

function AvatarBadge({ initials }: { initials?: string }) {
  const safeInitials = initials || "?";
  if (safeInitials.startsWith("http")) {
    return (
      <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
        <img src={safeInitials} alt="Avatar" className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-xs font-serif font-bold text-text-primary bg-surface flex-shrink-0"
    >
      {safeInitials}
    </div>
  );
}

export function ActivityStream() {
  const { data: activityEvents, isLoading } = useQuery({
    queryKey: ["activityStream"],
    queryFn: api.activity.getLiveStream,
    refetchInterval: 5000,
  });

  if (isLoading || !activityEvents) {
    return (
      <div className="editorial-card h-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="editorial-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="editorial-header text-lg">Live Activity</h2>
          <div className="text-xs text-text-secondary mt-1 tracking-wide uppercase">Team operations feed</div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
          <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 -mr-1 pr-1" style={{ maxHeight: "360px" }}>
        {activityEvents.map((event, i) => {
          const cfg = eventConfig[event.type];
          const EventIcon = cfg.Icon;
          return (
            <div
              key={event.id}
              className="flex items-start gap-4 pb-4 border-b border-border last:border-0"
            >
              <AvatarBadge initials={event.actorAvatar} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: cfg.bg }}
                  >
                    <EventIcon size={10} style={{ color: cfg.color }} />
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    <span className="font-semibold text-text-primary mr-1">{event.actor}</span>
                    {event.message}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-2 ml-7">
                  {event.repo && (
                    <span className="text-xs text-text-primary font-mono">{event.repo}</span>
                  )}
                  <span className="text-xs text-text-muted font-mono">{event.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
