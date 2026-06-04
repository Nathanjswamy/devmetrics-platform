"use client";

import { TopNav } from "../../components/TopNav";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { Rocket, GitMerge, AlertCircle, Star, Zap, Bell, Clock, Loader2 } from "lucide-react";

const eventConfig = {
  deploy: { Icon: Rocket, color: "#22D3EE", bg: "rgba(6,182,212,0.1)", label: "Deploy" },
  pr_merged: { Icon: GitMerge, color: "#34D399", bg: "rgba(16,185,129,0.1)", label: "PR Merged" },
  incident: { Icon: AlertCircle, color: "#FB7185", bg: "rgba(244,63,94,0.1)", label: "Incident" },
  review: { Icon: Star, color: "#FBBF24", bg: "rgba(245,158,11,0.1)", label: "Review" },
  commit: { Icon: Zap, color: "#818CF8", bg: "rgba(99,102,241,0.1)", label: "Commit" },
  alert: { Icon: Bell, color: "#F59E0B", bg: "rgba(245,158,11,0.1)", label: "Alert" },
};

function AvatarBadge({ initials }: { initials?: string }) {
  const safeInitials = initials || "?";
  if (safeInitials.startsWith("http")) {
    return (
      <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-border">
        <img src={safeInitials} alt="Avatar" className="w-full h-full object-cover" />
      </div>
    );
  }
  const colors = ["#6366F1", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B"];
  const color = colors[safeInitials.charCodeAt(0) % colors.length];
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
      style={{ background: color }}
    >
      {safeInitials}
    </div>
  );
}

export default function ActivityPage() {
  const { data: activityEvents, isLoading } = useQuery({
    queryKey: ["activityStream"],
    queryFn: api.activity.getLiveStream,
    refetchInterval: 5000,
  });

  if (isLoading || !activityEvents) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopNav title="Live Activity Stream" subtitle="Real-time team operations feed" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="animate-spin text-text-muted" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        title="Live Activity Stream"
        subtitle="Real-time team operations feed"
      />
      <main className="flex-1 p-6">
        <div className="max-w-3xl">
          {/* Filter tabs */}
          <div className="flex gap-2 mb-6">
            {["All", "Deploys", "PRs", "Incidents", "Reviews"].map((tab, i) => (
              <button
                key={tab}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: i === 0 ? "rgba(99,102,241,0.15)" : "var(--surface-2)",
                  color: i === 0 ? "#818CF8" : "#8B91B3",
                  border: `1px solid ${i === 0 ? "rgba(99,102,241,0.3)" : "var(--border)"}`,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-4 top-0 bottom-0 w-px"
              style={{ background: "var(--border)" }}
            />

            <div className="space-y-4">
              {activityEvents.map((event) => {
                const cfg = eventConfig[event.type];
                const EventIcon = cfg.Icon;
                return (
                  <div key={event.id} className="relative flex gap-4 pl-12">
                    {/* Timeline dot */}
                    <div
                      className="absolute left-2.5 top-3 w-3 h-3 rounded-full -translate-x-1/2 border-2"
                      style={{
                        background: cfg.color,
                        borderColor: "var(--bg)",
                        boxShadow: `0 0 8px ${cfg.color}60`,
                      }}
                    />

                    <div
                      className="flex-1 rounded-xl p-4 transition-all duration-200 hover:border-border-bright cursor-default"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                    >
                      <div className="flex items-start gap-3">
                        <AvatarBadge initials={event.actorAvatar} />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                                  style={{ background: cfg.bg, color: cfg.color }}
                                >
                                  <EventIcon size={9} />
                                  {cfg.label}
                                </div>
                              </div>
                              <p className="text-sm text-text-secondary">
                                <span className="font-semibold text-text-primary">{event.actor}</span>{" "}
                                {event.message}
                              </p>
                              {event.repo && (
                                <div className="flex items-center gap-1 mt-1.5 text-[11px] text-indigo-400 font-mono">
                                  {event.repo}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-text-muted flex-shrink-0">
                              <Clock size={11} />
                              {event.timestamp}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
