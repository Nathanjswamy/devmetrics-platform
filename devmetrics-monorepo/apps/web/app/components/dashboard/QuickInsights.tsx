"use client";

import { ArrowRight, AlertTriangle, CheckCircle, XCircle, Info, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import Link from "next/link";

const severityConfig = {
  info: { Icon: Info, color: "#53798C", bg: "rgba(83,121,140,0.1)", border: "rgba(83,121,140,0.25)" }, // Blue
  warning: { Icon: AlertTriangle, color: "#DE7A35", bg: "rgba(222,122,53,0.1)", border: "rgba(222,122,53,0.25)" }, // Orange
  critical: { Icon: XCircle, color: "#D05A44", bg: "rgba(208,90,68,0.1)", border: "rgba(208,90,68,0.25)" }, // Terracotta
  success: { Icon: CheckCircle, color: "#787B4E", bg: "rgba(120,123,78,0.1)", border: "rgba(120,123,78,0.25)" }, // Olive
};

export function QuickInsights() {
  const { data: aiInsights, isLoading } = useQuery({
    queryKey: ["quickInsights"],
    queryFn: api.insights.getAll,
  });

  if (isLoading || !aiInsights) {
    return (
      <div className="bauhaus-card p-5 h-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-text-muted" />
      </div>
    );
  }

  const topInsights = aiInsights.slice(0, 3);

  return (
    <div className="bauhaus-card p-5 h-full flex flex-col">
      <div className="section-header">
        <div>
          <div className="section-title">AI Insights</div>
          <div className="section-subtitle">Latest recommendations</div>
        </div>
        <Link
          href="/intelligence"
          className="text-[11px] text-[#2B6B6D] hover:text-[#53798C] font-semibold transition-colors flex items-center gap-1 uppercase tracking-widest"
        >
          View all <ArrowRight size={11} />
        </Link>
      </div>

      <div className="flex-1 space-y-2.5">
        {topInsights.map((insight) => {
          const cfg = severityConfig[insight.severity];
          const Icon = cfg.Icon;
          return (
            <div
              key={insight.id}
              className="p-3 cursor-pointer transition-transform hover:-translate-y-0.5"
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderLeft: `3px solid ${cfg.color}`,
                borderRadius: "2px"
              }}
            >
              <div className="flex items-start gap-2">
                <Icon size={14} style={{ color: cfg.color }} className="mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold text-text-primary line-clamp-1">
                    {insight.title}
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5 line-clamp-2">
                    {insight.description}
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-text-muted">{insight.createdAt}</span>
                    <div
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                      style={{ background: `${cfg.color}20`, color: cfg.color }}
                    >
                      {insight.confidence}% conf.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
