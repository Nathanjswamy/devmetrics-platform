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
import { Loader2 } from "lucide-react";

import { usePathname } from "next/navigation";

export default function DashboardPage() {
  const pathname = usePathname();
  console.log("DASHBOARD PAGE RENDERED AT PATHNAME:", pathname);

  const { data, isLoading } = useQuery({
    queryKey: ["executiveMetrics"],
    queryFn: api.metrics.getExecutive,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <Loader2 className="animate-spin text-text-muted w-8 h-8" />
      </div>
    );
  }

  const hasPrData = data?.hasPrData ?? false;
  const isEmpty = !data?.kpis || data.kpis.length === 0 || data.kpis.every((kpi: any) => String(kpi.value) === "0" || String(kpi.value) === "0%" || !kpi.value);

  if (isEmpty) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopNav title="Developer Intelligence Platform" subtitle="Welcome to DevMetrics" />
        <main className="flex-1 px-8 py-20 max-w-4xl mx-auto w-full flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-surface border border-border rounded-full flex items-center justify-center mb-8">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          <h2 className="text-4xl font-serif text-text-primary mb-4">Your Dashboard is Empty</h2>
          <p className="text-xl text-text-secondary mb-10 max-w-2xl">
            We need data to generate your engineering intelligence. Connect your GitHub account or your first repository to start generating your Developer DNA and performance metrics.
          </p>
          <a href="/integrations/github" className="btn-primary px-8 py-4 text-base shadow-lg shadow-border-bright/20" style={{ background: "#2B6B6D", color: "#F8F6F1" }}>
            Connect GitHub Repository
          </a>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        title="Developer Intelligence Platform"
        subtitle="Real-time overview of your engineering impact"
      />

      <main className="flex-1 px-8 py-10 max-w-7xl mx-auto w-full space-y-12">
        {/* Editorial Section 1: Dynamic KPIs */}
        <section>
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-2xl font-serif text-text-primary">Executive Summary</h2>
            <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">
              {hasPrData ? "DORA & Velocity" : "Activity & Health"}
            </span>
          </div>
          <DynamicKPICards />
        </section>

        <hr className="border-border" />

        {/* Editorial Section 2: Developer DNA (New Flagship Feature) */}
        <section>
          <DeveloperDNAWidget />
        </section>

        <hr className="border-border" />

        {/* Editorial Section 3: Universal Analytics (Always Available) */}
        <section className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 lg:col-span-8">
            <CommitAnalyticsWidget />
          </div>
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <RepositoryAnalyticsWidget />
          </div>
        </section>

        {/* Editorial Section 4: PR Analytics (Conditional) */}
        {hasPrData && (
          <>
            <hr className="border-border" />
            <section>
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="text-2xl font-serif text-text-primary">Pull Request Analytics</h2>
                <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">Review & Delivery</span>
              </div>
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-12 lg:col-span-5 space-y-8">
                  <HealthScoreWidget />
                  <DeploymentRiskMeter />
                </div>
                <div className="col-span-12 lg:col-span-7">
                  <SparklineChart />
                </div>
              </div>
            </section>
          </>
        )}

        <hr className="border-border" />

        {/* Editorial Section 5: AI Intelligence & Live Activity */}
        <section className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 lg:col-span-8">
            <QuickInsights />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <ActivityStream />
          </div>
        </section>
      </main>
    </div>
  );
}
