"use client";

import { Shield, AlertTriangle, CheckCircle, Info, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

const riskConfig = {
  low: { color: "#787B4E", bg: "rgba(120,123,78,0.1)", border: "rgba(120,123,78,0.25)", label: "Low Risk", Icon: CheckCircle }, // Olive
  medium: { color: "#DE7A35", bg: "rgba(222,122,53,0.1)", border: "rgba(222,122,53,0.25)", label: "Medium Risk", Icon: AlertTriangle }, // Orange
  high: { color: "#D05A44", bg: "rgba(208,90,68,0.1)", border: "rgba(208,90,68,0.25)", label: "High Risk", Icon: AlertTriangle }, // Terracotta
  critical: { color: "#D05A44", bg: "rgba(208,90,68,0.15)", border: "rgba(208,90,68,0.35)", label: "Critical Risk", Icon: AlertTriangle },
};

export function DeploymentRiskMeter() {
  const { data: deploymentRisk, isLoading } = useQuery({
    queryKey: ["deploymentRisk"],
    queryFn: api.metrics.getRisk,
  });

  if (isLoading || !deploymentRisk) {
    return (
      <div className="editorial-card h-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-text-muted" />
      </div>
    );
  }

  const { score, level, factors } = deploymentRisk;
  const cfg = riskConfig[level];
  const Icon = cfg.Icon;

  // Arc calculation
  const radius = 48;
  const circumference = Math.PI * radius; // half circle
  const offset = circumference * (1 - score / 100);

  return (
    <div className="editorial-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="editorial-header text-lg">Deployment Risk</h2>
          <div className="text-xs text-text-secondary mt-1 tracking-wide uppercase">Next 24h prediction</div>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
          style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
        >
          <Icon size={12} />
          {cfg.label}
        </div>
      </div>

      {/* Arc gauge */}
      <div className="flex flex-col items-center py-2">
        <div className="relative">
          <svg width="140" height="80" viewBox="0 0 140 80">
            {/* Background track */}
            <path
              d="M 10 70 A 60 60 0 0 1 130 70"
              fill="none"
              stroke="var(--border)"
              strokeWidth="2"
            />
            {/* Score fill */}
            <path
              d="M 10 70 A 60 60 0 0 1 130 70"
              fill="none"
              stroke={cfg.color}
              strokeWidth="4"
              strokeDasharray={`${circumference * (score / 100)} ${circumference}`}
            />
            {/* Score markers */}
            {[25, 50, 75].map((pct, i) => {
              const angle = -180 + (180 * pct) / 100;
              const rad = (angle * Math.PI) / 180;
              const x = 70 + 60 * Math.cos(rad);
              const y = 70 + 60 * Math.sin(rad);
              return (
                <circle key={i} cx={x} cy={y} r="2" fill="#2A2E42" />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
            <span className="text-4xl font-serif" style={{ color: cfg.color }}>
              {score}
            </span>
            <span className="text-[10px] text-text-muted tracking-widest uppercase">/ 100</span>
          </div>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between w-36 -mt-1">
          <span className="text-[10px] text-[#787B4E] font-bold tracking-widest uppercase">Low</span>
          <span className="text-[10px] text-[#DE7A35] font-bold tracking-widest uppercase">Med</span>
          <span className="text-[10px] text-[#D05A44] font-bold tracking-widest uppercase">High</span>
        </div>
      </div>

      {/* Factors */}
      <div className="mt-6 space-y-4 flex-1">
        <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
          <Info size={14} className="text-text-muted" />
          <span className="text-xs text-text-primary font-medium uppercase tracking-widest">Risk Factors</span>
        </div>
        {factors.map((f) => (
          <div key={f.label} className="flex items-center justify-between">
            <span className="text-xs text-text-secondary flex-1">{f.label}</span>
            <span className="text-xs font-serif text-text-primary">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
