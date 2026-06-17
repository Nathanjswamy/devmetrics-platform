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
import dynamic from "next/dynamic";
const PixelCanvas = dynamic(() => import("../../components/PixelCanvas").then(mod => mod.PixelCanvas), { ssr: false });

/* ─── Section wrapper ────────────────────────────────────────── */
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
          <Icon
            size={13}
            style={{ color: accent ? "var(--plum)" : "var(--smoke)", flexShrink: 0 }}
          />
        )}
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: accent ? "var(--plum)" : "var(--smoke)",
            textTransform: "uppercase",
            letterSpacing: "0.10em",
          }}
        >
          {label}
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
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
      <div className="flex flex-col min-h-screen items-center justify-center relative overflow-hidden" style={{ background: "#000000" }}>
        <PixelCanvas />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <Loader2 className="animate-spin w-5 h-5" style={{ color: "var(--plum)" }} />
          <p style={{ fontSize: "13px", color: "var(--smoke)", letterSpacing: "0.05em" }}>Loading intelligence…</p>
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
      <div className="flex flex-col min-h-screen relative overflow-hidden" style={{ background: "#000000" }}>
        <PixelCanvas />
        <div className="relative z-10">
          <TopNav title="DevMetrics" subtitle="Engineering Intelligence Platform" />
        </div>
        <main className="flex-1 px-8 py-20 max-w-4xl mx-auto w-full flex flex-col items-center text-center relative z-10 pointer-events-none">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-8 pointer-events-auto"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <Activity size={36} style={{ color: "var(--smoke)" }} />
          </div>
          <h2 className="pointer-events-auto" style={{ fontSize: "36px", fontWeight: 200, color: "var(--bone)", letterSpacing: "-0.04em", marginBottom: "16px" }}>
            {repoCount === 0 ? "Connect your first repository" : `${repoCount} repo${repoCount > 1 ? "s" : ""} synced`}
          </h2>
          <p style={{ fontSize: "15px", color: "var(--ash)", letterSpacing: "0.025em", marginBottom: "40px", maxWidth: "480px" }}>
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

        {/* ── Section 1: Engineering Priorities (AI Insights) ── */}
        <Section label="Engineering Priorities" icon={Sparkles} accent>
          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-12 lg:col-span-8">
              <QuickInsights />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <ActivityStream />
            </div>
          </div>
        </Section>

        {/* ── Section 2: Repository Intelligence ── */}
        <Section label="Repository Intelligence" icon={Activity}>
          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-12 lg:col-span-8">
              <CommitAnalyticsWidget />
            </div>
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <HealthScoreWidget />
              <RepositoryAnalyticsWidget />
            </div>
          </div>
        </Section>

        {/* ── Section 3: Developer DNA ── */}
        <Section label="Developer DNA" icon={Zap}>
          <DeveloperDNAWidget />
        </Section>

        {/* ── Section 4: Delivery Performance (DORA) ── */}
        <Section label="Delivery Performance (DORA)" icon={TrendingUp}>
          {hasPrData ? (
            <div className="space-y-10">
              <DynamicKPICards userId={userId as string} />
              
              <div className="grid grid-cols-12 gap-6 items-start">
                <div className="col-span-12 lg:col-span-7">
                  <PRCommandSummary />
                </div>
                <div className="col-span-12 lg:col-span-5 space-y-6">
                  <DeploymentRiskMeter />
                </div>
              </div>

              <div className="pt-2">
                <SparklineChart />
              </div>
            </div>
          ) : (
            <div className="editorial-card p-12 text-center" style={{ background: "var(--surface-2)", border: "1px dashed var(--border)" }}>
              <p className="font-sans text-lg" style={{ color: "var(--text-primary)" }}>Not enough pull request history.</p>
              <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>DORA metrics require merged pull requests to calculate lead time and deployment frequency.</p>
            </div>
          )}
        </Section>

      </main>
    </div>
  );
}
