"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { TopNav } from "../../components/TopNav";
import { DynamicKPICards } from "../../components/dashboard/DynamicKPICards";
import { DeveloperDNAWidget } from "../../components/dashboard/DeveloperDNAWidget";
import { CommitAnalyticsWidget } from "../../components/dashboard/CommitAnalyticsWidget";
import { RepositoryAnalyticsWidget } from "../../components/dashboard/RepositoryAnalyticsWidget";
import { QuickInsights } from "../../components/dashboard/QuickInsights";
import { SparklineChart } from "../../components/dashboard/SparklineChart";
import { HealthScoreWidget } from "../../components/dashboard/HealthScoreWidget";
import { DeploymentRiskMeter } from "../../components/dashboard/DeploymentRiskMeter";
import { ActivityStream } from "../../components/dashboard/ActivityStream";
import { RepositoryStatusPanel } from "../../components/dashboard/RepositoryStatusPanel";
import { PRCommandSummary } from "../../components/dashboard/PRCommandSummary";
import { createClient } from "../../../utils/supabase/client";
import { useEffect, useState } from "react";
import { Loader2, GitPullRequest, Zap, Shield, TrendingUp, Sparkles, Activity, BarChart2 } from "lucide-react";

/* ─── Section wrapper ───────────────────────────────────────── */
function Section({ label, icon: Icon, children, accent = false }: {
  label: string;
  icon?: any;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        {Icon && (
          <div className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: accent ? "var(--accent-maroon-dim)" : "var(--surface-2)", border: "1px solid var(--border)" }}>
            <Icon size={14} style={{ color: accent ? "var(--accent-maroon-light)" : "var(--text-muted)" }} />
          </div>
        )}
        <h2 className="font-serif font-bold text-lg" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          {label}
        </h2>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </div>
      {children}
    </section>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["executiveMetrics", userId],
    queryFn: () => api.metrics.getExecutive(userId as string),
    enabled: !!userId,
  });

  const { data: githubData } = useQuery({
    queryKey: ["githubStatus", userId],
    queryFn: () => api.integrations.getGithubStatus(userId as string),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "var(--accent-maroon-dim)", border: "1px solid var(--accent-maroon)" }}>
            <BarChart2 size={22} style={{ color: "var(--accent-maroon-light)" }} />
          </div>
          <Loader2 className="animate-spin w-5 h-5" style={{ color: "var(--text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading your engineering intelligence…</p>
        </div>
      </div>
    );
  }

  const hasPrData = data?.hasPrData ?? false;
  const isEmpty = !data?.kpis || data.kpis.length === 0;

  /* ── Empty / no-data state ── */
  if (isEmpty) {
    const repoCount = githubData?.repos?.length || 0;
    return (
      <div className="flex flex-col min-h-screen" style={{ background: "var(--bg)" }}>
        <TopNav title="DevMetrics" subtitle="Engineering Intelligence Platform" />
        <main className="flex-1 px-8 py-20 max-w-4xl mx-auto w-full flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <Activity size={36} style={{ color: "var(--text-muted)" }} />
          </div>
          <h2 className="font-serif text-3xl mb-4" style={{ color: "var(--text-primary)" }}>
            {repoCount === 0 ? "Connect your first repository" : `${repoCount} repo${repoCount > 1 ? "s" : ""} synced`}
          </h2>
          <p className="text-base mb-10 max-w-xl" style={{ color: "var(--text-secondary)" }}>
            {repoCount === 0
              ? "Connect GitHub to start generating real-time developer insights, DORA metrics, and AI recommendations."
              : "Your repositories are synced. Ensure they have pull requests and commits to populate the dashboard."}
          </p>
          {userId && <RepositoryStatusPanel userId={userId} />}
        </main>
      </div>
    );
  }

  /* ── Full dashboard ── */
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg)" }}>
      <TopNav
        title="DevMetrics"
        subtitle="Real-time engineering intelligence"
      />

      <main className="flex-1 px-8 py-8 max-w-7xl mx-auto w-full space-y-10">

        {/* Status / sync panel */}
        {userId && (
          <div>
            <RepositoryStatusPanel userId={userId} />
          </div>
        )}

        {/* ── Section 1: KPI Summary ── */}
        <Section label="Executive Summary" icon={TrendingUp} accent>
          <DynamicKPICards userId={userId as string} />
        </Section>

        {/* ── Section 2: Developer DNA ── */}
        <Section label="Developer DNA" icon={Zap}>
          <DeveloperDNAWidget />
        </Section>

        {/* ── Section 3: Commit + Repository activity ── */}
        <Section label="Repository Intelligence" icon={Activity}>
          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-12 lg:col-span-8">
              <CommitAnalyticsWidget />
            </div>
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <RepositoryAnalyticsWidget />
            </div>
          </div>
        </Section>

        {/* ── Section 4: PR Tracking (real data only when PRs exist) ── */}
        {hasPrData && (
          <>
            <Section label="Pull Request Command Center" icon={GitPullRequest}>
              <div className="grid grid-cols-12 gap-6 items-start">
                <div className="col-span-12 lg:col-span-7">
                  <PRCommandSummary />
                </div>
                <div className="col-span-12 lg:col-span-5 space-y-6">
                  <HealthScoreWidget />
                  <DeploymentRiskMeter />
                </div>
              </div>
            </Section>

            <Section label="Lead Time & Velocity Trends" icon={BarChart2}>
              <SparklineChart />
            </Section>
          </>
        )}

        {/* ── Section 5: AI Intelligence + Live Feed ── */}
        <Section label="AI Insights & Live Activity" icon={Sparkles} accent>
          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-12 lg:col-span-8">
              <QuickInsights />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <ActivityStream />
            </div>
          </div>
        </Section>

      </main>
    </div>
  );
}
