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
      <div className="bauhaus-card p-5 h-full flex flex-col items-center justify-center">
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
    <div className="bauhaus-card p-5 h-full flex flex-col">
      <div className="section-header">
        <div>
          <div className="section-title">Deployment Risk</div>
          <div className="section-subtitle">Next 24h prediction</div>
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
              stroke="#DFD8C8" // var(--surface-3)
              strokeWidth="12"
              strokeLinecap="square" // Bauhaus sharp ends
            />
            {/* Score fill */}
            <path
              d="M 10 70 A 60 60 0 0 1 130 70"
              fill="none"
              stroke={cfg.color}
              strokeWidth="12"
              strokeLinecap="square"
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
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            <span className="text-3xl font-bold" style={{ color: cfg.color }}>
              {score}
            </span>
            <span className="text-[10px] text-text-muted">/ 100</span>
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
      <div className="mt-3 space-y-2.5 flex-1">
        <div className="flex items-center gap-1 mb-2">
          <Info size={11} className="text-text-muted" />
          <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Risk Factors</span>
        </div>
        {factors.map((f) => (
          <div key={f.label} className="flex items-center justify-between">
            <span className="text-[11px] text-text-muted flex-1">{f.label}</span>
            <span className="text-[11px] font-semibold text-text-secondary">{f.value}</span>
            <div className="w-16 h-1 rounded-full ml-3" style={{ background: "var(--border)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${f.weight}%`,
                  background: f.weight > 25 ? "#F59E0B" : "#6366F1",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
