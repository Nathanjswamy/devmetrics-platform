"use client";

import { Rocket, GitMerge, AlertCircle, Star, Zap, Bell, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

const eventConfig = {
  deploy: { Icon: Rocket, color: "#53798C", bg: "rgba(83,121,140,0.1)" }, // Blue
  pr_merged: { Icon: GitMerge, color: "#787B4E", bg: "rgba(120,123,78,0.1)" }, // Olive
  incident: { Icon: AlertCircle, color: "#D05A44", bg: "rgba(208,90,68,0.1)" }, // Terracotta
  review: { Icon: Star, color: "#DE7A35", bg: "rgba(222,122,53,0.1)" }, // Orange
  commit: { Icon: Zap, color: "#2B6B6D", bg: "rgba(43,107,109,0.1)" }, // Teal
  alert: { Icon: Bell, color: "#D4AF37", bg: "rgba(212,175,55,0.1)" }, // Gold
};

function AvatarBadge({ initials }: { initials?: string }) {
  const safeInitials = initials || "?";
  const colors = ["#53798C", "#787B4E", "#DE7A35", "#2B6B6D", "#D4AF37"];
  const color = colors[safeInitials.charCodeAt(0) % colors.length];
  return (
    <div
      className="w-7 h-7 rounded-sm flex items-center justify-center text-[10px] font-bold text-[#F8F6F1] flex-shrink-0"
      style={{ background: color }}
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
      <div className="bauhaus-card p-5 h-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="bauhaus-card p-5 h-full flex flex-col">
      <div className="section-header">
        <div>
          <div className="section-title">Live Activity</div>
          <div className="section-subtitle">Team operations feed</div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-none bg-[#787B4E] animate-ping" />
          <span className="text-[10px] text-[#787B4E] font-semibold uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 -mr-1 pr-1" style={{ maxHeight: "320px" }}>
        {activityEvents.map((event, i) => {
          const cfg = eventConfig[event.type];
          const EventIcon = cfg.Icon;
          return (
            <div
              key={event.id}
              className="flex items-start gap-2.5 p-2.5 rounded-xl transition-all duration-200 hover:bg-surface-3 cursor-default group"
            >
              <AvatarBadge initials={event.actorAvatar} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-1.5">
                  <div
                    className="w-5 h-5 rounded-none flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: cfg.bg }}
                  >
                    <EventIcon size={11} style={{ color: cfg.color }} />
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2 group-hover:text-text-primary transition-colors">
                    <span className="font-semibold text-text-primary">{event.actor}</span>{" "}
                    {event.message}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1 ml-6">
                  {event.repo && (
                    <span className="text-[10px] text-[#53798C] font-mono font-bold">{event.repo}</span>
                  )}
                  <span className="text-[10px] text-text-muted">{event.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
