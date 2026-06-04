"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { Loader2, Fingerprint, Star, Zap, Target, Users, Code2 } from "lucide-react";

export function DeveloperDNAWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ["developerDna"],
    queryFn: async () => {
      const res = await fetch("/api/v1/metrics/dna");
      return res.json();
    },
  });

  if (isLoading || !data) {
    return (
      <div className="editorial-card h-64 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-text-muted" />
      </div>
    );
  }

  const dimColors: Record<string, string> = {
    consistency: "#6366F1",
    velocity: "#06B6D4",
    focus: "#8B5CF6",
    collaboration: "#10B981",
    impact: "#F59E0B"
  };

  const dimIcons: Record<string, any> = {
    consistency: Target,
    velocity: Zap,
    focus: Code2,
    collaboration: Users,
    impact: Star
  };

  return (
    <div className="editorial-card p-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Fingerprint className="text-accent-orange" size={24} />
            <h2 className="editorial-header text-xl m-0">Developer DNA</h2>
          </div>
          <div className="text-xs text-text-secondary uppercase tracking-wider mb-6">Profile Synthesis</div>
          
          <div className="flex items-end gap-3 mb-2">
            <div className="text-4xl font-serif font-bold text-text-primary leading-none">{data.archetype}</div>
          </div>
          <div className="text-sm font-medium text-text-muted mb-6">Overall Score: <span className="text-text-primary font-bold">{data.score}/100</span></div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-accent-green mb-3">Strengths</h4>
              <ul className="space-y-2">
                {data.strengths.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-accent-green text-lg leading-none">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-accent-orange mb-3">Growth Areas</h4>
              <ul className="space-y-2">
                {data.growthAreas.map((g: string, i: number) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-accent-orange text-lg leading-none">•</span> {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-64 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">Core Dimensions</h4>
          {Object.entries(data.dimensions).map(([key, score]) => {
            const val = score as number;
            const Icon = dimIcons[key];
            return (
              <div key={key}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-text-secondary flex items-center gap-1.5 capitalize font-medium">
                    <Icon size={12} />
                    {key}
                  </span>
                  <span className="font-bold text-text-primary">{val}</span>
                </div>
                <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ width: `${val}%`, backgroundColor: dimColors[key] }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
