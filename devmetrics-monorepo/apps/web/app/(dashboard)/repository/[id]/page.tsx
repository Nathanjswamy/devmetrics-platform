"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../../lib/api";
import { ProjectCoach } from "../../../components/coach/ProjectCoach";
import { Loader2, Shield, Database, LayoutTemplate, CheckCircle2, FileText, Package, AlertTriangle, GitBranch } from "lucide-react";
import { AIInsight, RepositoryScore } from "../../../types";

export default function RepositoryDrilldownPage() {
  const params = useParams();
  const repoId = params.id as string;
  
  const [repo, setRepo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.intelligence.getRepository(repoId);
        setRepo(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [repoId]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  if (!repo || !repo.score) {
    return (
      <div className="editorial-card text-center py-20 mt-10">
        <h2 className="text-xl font-semibold mb-2">Intelligence Data Not Available</h2>
        <p className="text-gray-400 mb-6">
          We need to complete an AI analysis scan for this repository to generate the intelligence dashboard.
        </p>
      </div>
    );
  }

  const score: RepositoryScore = repo.score;
  const insights: AIInsight[] = repo.insights || [];
  
  const parseJsonArr = (str: string) => {
    try { return JSON.parse(str); } catch { return []; }
  };

  const strengths = parseJsonArr(score.strengths);
  const weaknesses = parseJsonArr(score.weaknesses);
  const risks = parseJsonArr(score.risks);

  const MetricCard = ({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) => (
    <div className="editorial-card flex flex-col gap-2">
      <div className="flex items-center gap-2 text-gray-400">
        <Icon size={16} />
        <span className="text-xs uppercase font-semibold tracking-wider">{title}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-4xl font-light tracking-tight" style={{ color }}>{value}</span>
        <span className="text-gray-500 text-sm mb-1">/100</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitBranch size={20} className="text-gray-400" />
            <h1 className="text-2xl font-bold tracking-tight">{repo.name}</h1>
          </div>
          <p className="text-gray-500 text-sm">Engineering Intelligence & Repository Health</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Project Score</div>
          <div className={`text-4xl font-light ${score.projectScore > 80 ? 'text-lichen' : score.projectScore > 60 ? 'text-warning' : 'text-danger'}`}>
            {score.projectScore}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard title="Security" value={score.securityScore} icon={Shield} color="var(--bone)" />
        <MetricCard title="Architecture" value={score.architectureScore} icon={LayoutTemplate} color="var(--bone)" />
        <MetricCard title="Tech Debt" value={score.techDebtScore} icon={Database} color="var(--bone)" />
        <MetricCard title="Testing" value={score.testingScore} icon={CheckCircle2} color="var(--bone)" />
        <MetricCard title="Docs" value={score.documentationScore} icon={FileText} color="var(--bone)" />
        <MetricCard title="Dependencies" value={score.dependencyScore} icon={Package} color="var(--bone)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="editorial-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Executive Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs text-lichen uppercase tracking-wider mb-2 flex items-center gap-2"><CheckCircle2 size={14}/> Strengths</h4>
                <ul className="space-y-2">
                  {strengths.map((s: string, i: number) => <li key={i} className="text-sm text-gray-300">• {s}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-xs text-warning uppercase tracking-wider mb-2 flex items-center gap-2"><AlertTriangle size={14}/> Weaknesses & Risks</h4>
                <ul className="space-y-2">
                  {weaknesses.map((w: string, i: number) => <li key={i} className="text-sm text-gray-300">• {w}</li>)}
                  {risks.map((r: string, i: number) => <li key={i} className="text-sm text-danger/80">• {r}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Priority Action Items</h3>
            <div className="space-y-3">
              {insights.map(insight => (
                <div key={insight.id} className="editorial-card bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`badge-${insight.priority === 'critical' ? 'critical' : insight.priority === 'high' ? 'warning' : 'info'}`}>
                      {insight.priority.toUpperCase()} PRIORITY
                    </span>
                    <span className="text-xs text-gray-500">{insight.category}</span>
                  </div>
                  <h4 className="text-md font-semibold text-white mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-400 mb-3">{insight.problem}</p>
                  <div className="p-3 rounded-lg bg-plum/10 border border-plum/20">
                    <span className="text-xs text-plum font-semibold uppercase tracking-wider block mb-1">Recommendation</span>
                    <span className="text-sm text-gray-200">{insight.recommendation}</span>
                  </div>
                </div>
              ))}
              {insights.length === 0 && (
                <div className="text-sm text-gray-500">No pending action items for this repository.</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <ProjectCoach repoId={repoId} repoName={repo.name} />
        </div>
      </div>
    </div>
  );
}
