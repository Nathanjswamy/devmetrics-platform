"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { AIInsight } from "../../types";
import { AlertTriangle, AlertCircle, Info, Zap, ArrowRight, Loader2, GitPullRequest, Code, FileText, Package, Database, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function PrioritiesPage() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.insights.getAll();
        // Sort by priority (critical > high > medium > low > info)
        const priorityScore = { critical: 5, high: 4, medium: 3, low: 2, info: 1 };
        const sorted = data.sort((a, b) => (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0));
        setInsights(sorted);
      } catch (error) {
        console.error("Failed to load insights", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "var(--danger)";
      case "high": return "var(--warning)";
      case "medium": return "var(--info)";
      case "low": return "var(--lichen)";
      default: return "var(--smoke)";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'security': return <ShieldAlert size={16} />;
      case 'architecture': return <Database size={16} />;
      case 'tech_debt': return <Code size={16} />;
      case 'testing': return <GitPullRequest size={16} />;
      case 'documentation': return <FileText size={16} />;
      case 'dependency': return <Package size={16} />;
      default: return <Zap size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="editorial-card text-center py-20 mt-10">
        <h2 className="text-xl font-semibold mb-2">No enough repository data available.</h2>
        <p className="text-gray-400 mb-6">
          We need more data (commits, PRs, file tree structure) to generate engineering priorities.
        </p>
        <button className="btn-primary">Sync Repositories</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Engineering Priorities</h1>
        <p className="text-gray-400">Actionable, prioritized engineering tasks generated from repository intelligence.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {insights.map((insight) => (
          <div key={insight.id} className="editorial-card flex flex-col gap-4" style={{ borderLeft: \`3px solid \${getPriorityColor(insight.priority)}\` }}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={\`badge-\${insight.priority === 'critical' ? 'critical' : insight.priority === 'high' ? 'warning' : 'info'}\`}>
                    {insight.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                    {getCategoryIcon(insight.category)} {insight.category}
                  </span>
                  {insight.confidence && (
                    <span className="text-xs text-gray-500 flex items-center gap-1" title="AI Confidence">
                      • {insight.confidence}% Confidence
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                {insight.affectedTeam && (
                  <Link href={\`/repository/\${insight.repoId}\`} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors mt-1 inline-flex items-center gap-1">
                    Repository: {insight.affectedTeam} <ArrowRight size={12} />
                  </Link>
                )}
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                {insight.effort && (
                  <span className="text-xs text-gray-400 border border-gray-800 bg-black rounded-md px-2 py-1">
                    Effort: {insight.effort}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-1">
                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Problem</span>
                <p className="text-sm text-gray-300 leading-relaxed">{insight.problem || "Unspecified problem"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Impact</span>
                <p className="text-sm text-gray-300 leading-relaxed">{insight.impact || "Unspecified impact"}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <span className="text-xs text-indigo-400 uppercase font-semibold tracking-wider mb-1 block">Recommendation</span>
                <p className="text-sm text-white font-medium">{insight.recommendation}</p>
              </div>
              {insight.expectedOutcome && (
                <div className="text-right">
                  <span className="text-xs text-green-400/70 uppercase font-semibold tracking-wider mb-1 block">Expected Outcome</span>
                  <p className="text-sm text-gray-300">{insight.expectedOutcome}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
