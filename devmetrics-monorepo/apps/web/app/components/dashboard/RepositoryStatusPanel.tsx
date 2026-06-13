"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { GitBranch, RefreshCw, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface RepositoryStatusPanelProps {
  userId: string;
}

export function RepositoryStatusPanel({ userId }: RepositoryStatusPanelProps) {
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["githubStatus", userId],
    queryFn: () => api.integrations.getGithubStatus(userId),
    enabled: !!userId,
    refetchInterval: syncing ? 2000 : false, // Poll if syncing
  });

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.sync.trigger(userId);
      await queryClient.invalidateQueries({ queryKey: ["githubStatus", userId] });
      // Invalidate all dashboard metrics so they auto-refresh!
      await queryClient.invalidateQueries({ queryKey: ["executiveMetrics"] });
      await queryClient.invalidateQueries({ queryKey: ["commitAnalytics"] });
      await queryClient.invalidateQueries({ queryKey: ["repoAnalytics"] });
    } catch (e) {
      console.error("Sync failed", e);
    } finally {
      setSyncing(false);
    }
  };

  if (isLoading) return null;
  
  console.log("[FRONTEND LOG] RepositoryStatusPanel data:", data);

  // Not connected
  if (!data?.integration) {
    return (
      <div className="editorial-card p-8 flex flex-col items-center justify-center text-center bg-surface w-full max-w-2xl mt-8">
        <GitBranch size={32} className="mb-4 text-text-muted" />
        <h3 className="text-xl font-sans text-text-primary mb-2">GitHub Not Connected</h3>
        <p className="text-text-secondary mb-6 text-sm">
          Connect your GitHub account to import repositories and begin generating metrics.
        </p>
        <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/integrations/github/auth?userId=${userId}`} className="btn-primary text-sm">
          Connect GitHub
        </a>
      </div>
    );
  }

  const repos = data.repos || [];
  const hasRepos = repos.length > 0;
  
  // Find the most recent sync time
  const lastSyncTime = hasRepos 
    ? repos.reduce((latest: Date, repo: any) => {
        if (!repo.lastSyncedAt) return latest;
        const syncDate = new Date(repo.lastSyncedAt);
        return syncDate > latest ? syncDate : latest;
      }, new Date(0))
    : null;

  return (
    <div className="editorial-card p-6 bg-surface w-full max-w-3xl mt-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-green/10 flex items-center justify-center">
            <GitBranch size={20} className="text-accent-green" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">Repository Sync Status</h3>
            <p className="text-xs text-text-muted">Connected as {data.integration.profileId}</p>
          </div>
        </div>
        
        <button 
          onClick={handleSync}
          disabled={syncing}
          className="btn-secondary text-sm flex items-center gap-2"
        >
          <RefreshCw size={14} className={syncing ? "animate-spin text-accent-green" : ""} />
          {syncing ? "Syncing..." : "Sync Now"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
        <div className="flex flex-col">
          <span className="text-xs text-text-muted uppercase tracking-wider mb-1">Connected GitHub</span>
          <span className="text-sm font-semibold flex items-center gap-1.5 text-text-primary">
            <CheckCircle size={14} className="text-accent-green" /> YES
          </span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs text-text-muted uppercase tracking-wider mb-1">Repositories Imported</span>
          <span className="text-sm font-semibold text-text-primary">
            {hasRepos ? repos.length : <span className="text-text-muted font-normal">None</span>}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-text-muted uppercase tracking-wider mb-1">Last Sync</span>
          <span className="text-sm font-semibold text-text-primary">
            {lastSyncTime && lastSyncTime.getTime() > 0 ? formatDistanceToNow(lastSyncTime, { addSuffix: true }) : <span className="text-text-muted font-normal">Never</span>}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-text-muted uppercase tracking-wider mb-1">Analysis Status</span>
          <span className="text-sm font-semibold flex items-center gap-1.5 text-text-primary">
            {syncing ? (
              <><RefreshCw size={14} className="animate-spin text-yellow-500" /> Processing</>
            ) : hasRepos ? (
              <><CheckCircle size={14} className="text-accent-green" /> Completed</>
            ) : (
              <><Clock size={14} className="text-text-muted" /> Pending</>
            )}
          </span>
        </div>
      </div>

      {!hasRepos && !syncing && (
        <div className="mt-6 p-4 border border-dashed border-border rounded text-center">
          <p className="text-sm text-text-secondary">No repositories imported.</p>
          <p className="text-xs text-text-muted mt-1">Click 'Sync Now' to pull in your repositories and generate metrics.</p>
        </div>
      )}
    </div>
  );
}
