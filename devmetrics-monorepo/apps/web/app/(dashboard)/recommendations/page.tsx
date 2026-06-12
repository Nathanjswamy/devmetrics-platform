"use client";

import { TopNav } from "../../components/TopNav";
import { AlertTriangle, CheckCircle, Info, ArrowRight, Loader2, Target, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export default function RecommendationsPage() {
  const { data: aiInsights, isLoading } = useQuery({
    queryKey: ["allInsights"],
    queryFn: api.insights.getAll,
  });

  if (isLoading || !aiInsights) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopNav title="Actionable Recommendations" subtitle="Top developer actions ranked by impact" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="animate-spin text-text-muted" />
        </main>
      </div>
    );
  }

  // Filter out non-actionable insights and sort by severity
  const actions = [...aiInsights]
    .filter(i => i.severity === 'critical' || i.severity === 'warning')
    .sort((a, b) => a.severity === 'critical' ? -1 : 1);

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        title="Actionable Recommendations"
        subtitle="Top developer actions ranked by impact"
      />

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
        <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-2xl font-serif text-text-primary mb-1">Top Priorities Today</h2>
            <p className="text-text-secondary">Based on real-time database aggregations of your repository activity.</p>
          </div>
          <div className="flex items-center gap-2 bg-surface-2 px-3 py-1.5 rounded border border-border text-sm font-bold tracking-widest uppercase text-text-primary">
            <Target size={16} className="text-accent-blue" />
            {actions.length} Action{actions.length !== 1 && 's'} Found
          </div>
        </div>

        {actions.length === 0 ? (
          <div className="editorial-card p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-accent-green" />
            </div>
            <h3 className="text-xl font-serif text-text-primary mb-2">You're all caught up!</h3>
            <p className="text-text-secondary">No actionable recommendations found across your repositories.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {actions.map((action, index) => {
              const isCritical = action.severity === 'critical';
              return (
                <div 
                  key={action.id}
                  className="editorial-card overflow-hidden group hover:bg-surface-2 transition-colors cursor-pointer"
                  style={{ borderLeft: `4px solid ${isCritical ? '#0F172A' : '#C86A3D'}` }}
                >
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex flex-col items-center justify-center mt-1">
                      <div className="w-10 h-10 bg-surface-2 border border-border rounded flex items-center justify-center font-serif text-lg font-bold text-text-primary">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded" style={{ background: isCritical ? 'rgba(15,23,42,0.1)' : 'rgba(200,106,61,0.1)', color: isCritical ? '#0F172A' : '#C86A3D' }}>
                          {action.category}
                        </span>
                        <span className="text-xs font-mono text-text-secondary">
                          {action.affectedTeam || 'Global'}
                        </span>
                      </div>
                      <h3 className="text-lg font-serif font-bold text-text-primary mb-2">{action.title}</h3>
                      
                      <div className="space-y-4 mt-4">
                        <div className="flex items-start gap-2">
                          <AlertTriangle size={16} className="text-text-muted mt-0.5" />
                          <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary block mb-1">The Problem</span>
                            <p className="text-sm text-text-primary leading-relaxed">{action.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Zap size={16} className="text-accent-blue mt-0.5" />
                          <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary block mb-1">Suggested Action</span>
                            <p className="text-sm text-text-primary leading-relaxed">{action.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end pt-2 space-y-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="flex items-center gap-2 px-4 py-2 bg-text-primary text-surface text-xs font-bold uppercase tracking-widest rounded hover:bg-text-secondary transition-colors">
                         Resolve <ArrowRight size={14} />
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
