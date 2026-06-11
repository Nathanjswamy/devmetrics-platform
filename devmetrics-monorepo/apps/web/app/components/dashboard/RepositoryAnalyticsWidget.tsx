"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { Loader2, FolderGit2, Activity } from "lucide-react";

export function RepositoryAnalyticsWidget() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["repoAnalytics"],
    queryFn: api.analytics.getRepos,
  });

  if (isLoading) {
    return (
      <div className="editorial-card h-64 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-accent-teal w-8 h-8" />
        <span className="text-sm font-medium text-text-muted">Loading repositories...</span>
      </div>
    );
  }

  if (isError || !data || data.activity.length === 0) {
    return (
      <div className="editorial-card h-64 flex flex-col items-center justify-center space-y-2 p-6 text-center">
        <FolderGit2 className="text-text-muted mb-2 w-8 h-8 opacity-50" />
        <p className="text-sm font-medium text-text-primary">No repository data available</p>
        <p className="text-xs text-text-muted">Connect GitHub to see active projects.</p>
      </div>
    );
  }

  return (
    <div className="editorial-card h-full flex flex-col p-6">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FolderGit2 className="text-accent-teal" size={20} />
            <h2 className="editorial-header text-lg m-0">Repository Activity</h2>
          </div>
          <div className="text-xs text-text-secondary uppercase tracking-wider">Top active projects</div>
        </div>
        <div className="text-right">
          <div className="text-text-primary text-xl font-bold">{data.active} <span className="text-xs font-normal text-text-muted">/ {data.total}</span></div>
          <div className="text-[10px] uppercase tracking-wide text-text-secondary">Active Repos</div>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {data.activity.slice(0, 4).map((repo: any, i: number) => (
          <div key={repo.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center border border-border">
                <Activity size={14} className="text-text-secondary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary">{repo.name}</div>
                <div className="text-xs text-text-muted">Last 30 days</div>
              </div>
            </div>
            <div className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              {repo.commits} <span className="text-xs font-normal text-text-muted uppercase">commits</span>
            </div>
          </div>
        ))}

        {data.activity.length === 0 && (
          <div className="text-sm text-text-muted text-center py-6">
            No active repositories in the last 30 days.
          </div>
        )}
      </div>
    </div>
  );
}
