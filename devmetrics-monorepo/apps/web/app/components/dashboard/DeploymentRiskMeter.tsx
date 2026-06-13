"use client";

import { Shield, AlertTriangle, CheckCircle, Info, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

const riskConfig = {
  low: { color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0", label: "Low Risk", Icon: CheckCircle },
  medium: { color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", label: "Medium Risk", Icon: AlertTriangle },
  high: { color: "#EF4444", bg: "#FEF2F2", border: "#FECACA", label: "High Risk", Icon: AlertTriangle },
  critical: { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", label: "Critical Risk", Icon: AlertTriangle },
};

export function DeploymentRiskMeter() {
  const { data: deploymentRisk, isLoading } = useQuery({
    queryKey: ["deploymentRisk"],
    queryFn: api.metrics.getRisk,
  });

  if (isLoading || !deploymentRisk) {
    return (
      <div className="editorial-card h-full flex flex-col gap-4 p-6">
        <div className="skeleton h-5 w-36" />
        <div className="skeleton h-24 w-36 rounded-full mx-auto" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-2 w-full" />)}
        </div>
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
                <circle key={i} cx={x} cy={y} r="2" fill="var(--surface-3)" />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
            <span className="text-4xl font-sans" style={{ color: cfg.color }}>
              {score}
            </span>
            <span className="text-[10px] tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>/ 100</span>
          </div>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between w-36 -mt-1">
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#10B981" }}>Low</span>
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#F59E0B" }}>Med</span>
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#EF4444" }}>High</span>
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
            <span className="text-xs font-sans text-text-primary">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
