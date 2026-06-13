"use client";

import { useQuery } from "@tanstack/react-query";
import { TopNav } from "../../components/TopNav";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function StatusPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["systemStatus"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/status`);
      if (!res.ok) throw new Error("Failed to fetch status");
      return res.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopNav title="System Status" subtitle="Real-time infrastructure health" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-text-muted w-8 h-8" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopNav title="System Status" subtitle="Real-time infrastructure health" />
        <div className="flex-1 flex items-center justify-center text-accent-red">
          <AlertTriangle className="mr-2" /> Error loading system status.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="System Status" subtitle="Real-time infrastructure health" />
      <main className="flex-1 px-8 py-10 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-sans text-text-primary mb-6">Service Health</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatusCard 
            title="Database Health" 
            value={data.databaseHealth} 
            status={data.databaseHealth === "healthy" ? "ok" : "error"} 
          />
          <StatusCard 
            title="AI Intelligence API" 
            value={data.aiServiceStatus} 
            status={data.aiServiceStatus === "operational" ? "ok" : "warn"} 
          />
          <StatusCard 
            title="GitHub Connection" 
            value={data.githubConnection} 
            status={data.githubConnection === "connected" ? "ok" : "error"} 
          />
          <StatusCard 
            title="Repository Sync" 
            value={data.repositoryCount.toString()} 
            subtitle="Repositories Indexed"
            status="info" 
          />
          <StatusCard 
            title="Commit History" 
            value={data.commitCount.toLocaleString()} 
            subtitle="Commits Processed"
            status="info" 
          />
          <StatusCard 
            title="Last Sync Time" 
            value={data.lastSyncTime ? formatDistanceToNow(new Date(data.lastSyncTime), { addSuffix: true }) : 'Never'} 
            status={data.githubConnection === "connected" ? "ok" : "warn"} 
          />
        </div>
      </main>
    </div>
  );
}

function StatusCard({ title, value, subtitle, status }: { title: string, value: string, subtitle?: string, status: "ok" | "warn" | "error" | "info" }) {
  let icon;
  let valueColor;
  
  switch (status) {
    case "ok":
      icon = <CheckCircle className="text-accent-green" size={20} />;
      valueColor = "text-text-primary";
      break;
    case "warn":
      icon = <AlertTriangle className="text-accent-orange" size={20} />;
      valueColor = "text-accent-orange";
      break;
    case "error":
      icon = <XCircle className="text-accent-red" size={20} />;
      valueColor = "text-accent-red";
      break;
    case "info":
      icon = null;
      valueColor = "text-text-primary";
      break;
  }

  return (
    <div className="editorial-card flex flex-col justify-between">
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center justify-between">
        {title}
        {icon}
      </h3>
      <div>
        <p className={`text-2xl font-sans capitalize tracking-tight ${valueColor}`}>{value}</p>
        {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
