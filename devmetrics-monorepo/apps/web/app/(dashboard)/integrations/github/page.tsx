"use client";
import { useEffect, useState } from "react";
import { TopNav } from "../../../components/TopNav";
import { CheckCircle, AlertCircle, RefreshCw, GitBranch } from "lucide-react";
import { api } from "../../../lib/api";
import { createClient } from "../../../../utils/supabase/client";

export default function GitHubIntegrationPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        api.integrations.getGithubStatus(user.id)
          .then(d => {
            setData(d);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, []);

  const triggerSync = async () => {
    if (!userId) return;
    setSyncing(true);
    try {
      await api.sync.trigger(userId);
      // Reload
      const d = await api.integrations.getGithubStatus(userId);
      setData(d);
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="GitHub Integration" subtitle="Manage your connected repositories" />
      <main className="flex-1 p-6">
        {!data ? (
          <div className="editorial-card p-12 flex flex-col items-center justify-center text-center">
            <GitBranch size={48} className="mb-6 text-text-secondary" />
            <h2 className="editorial-header text-2xl mb-2">Not Connected</h2>
            <p className="text-text-secondary mt-2 mb-8 max-w-md">Authorize DevMetrics to securely analyze your repositories and pull requests.</p>
            <div className="flex gap-4">
              <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/integrations/github/auth?userId=${userId}`} className="btn-primary">
                Connect GitHub Account
              </a>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8 editorial-card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded flex items-center justify-center bg-surface-2 border border-border">
                  <GitBranch size={24} className="text-text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-text-primary">Connected as {data.integration.profileId}</h2>
                  <p className="text-sm text-text-muted">Connected at {new Date(data.integration.connectedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={triggerSync}
                  disabled={syncing}
                  className="btn-primary flex items-center gap-2"
                >
                  <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
                  {syncing ? 'Syncing...' : 'Sync Now'}
                </button>
                <button className="btn-secondary text-red-500 border-red-500/30 hover:bg-red-500/10">Disconnect</button>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-4">Synced Repositories</h3>
            {data.repos.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border rounded-sm text-text-muted">
                No repositories synced yet. Click "Sync Now" to fetch recent repositories.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.repos.map((repo: any) => (
                  <div key={repo.id} className="bauhaus-card p-5">
                    <div className="flex justify-between items-start mb-2">
                      <a href={repo.url} target="_blank" rel="noreferrer" className="text-base font-bold text-blue-400 hover:underline">
                        {repo.name}
                      </a>
                      {repo.syncStatus === 'syncing' ? (
                        <span className="flex items-center gap-1 text-xs text-yellow-500"><RefreshCw size={12} className="animate-spin" /> Syncing</span>
                      ) : repo.syncStatus === 'error' ? (
                        <span className="flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} /> Error</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-green-500"><CheckCircle size={12} /> Synced</span>
                      )}
                    </div>
                    <div className="text-xs text-text-muted">
                      Last synced: {repo.lastSyncedAt ? new Date(repo.lastSyncedAt).toLocaleString() : 'Never'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
