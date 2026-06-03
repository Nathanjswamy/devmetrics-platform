"use client";

import { TopNav } from "./components/TopNav";
import { DoraKPICards } from "./components/dashboard/DoraKPICards";
import { HealthScoreWidget } from "./components/dashboard/HealthScoreWidget";
import { ActivityStream } from "./components/dashboard/ActivityStream";
import { DeploymentRiskMeter } from "./components/dashboard/DeploymentRiskMeter";
import { SparklineChart } from "./components/dashboard/SparklineChart";
import { QuickInsights } from "./components/dashboard/QuickInsights";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        title="Engineering Intelligence Dashboard"
        subtitle="Real-time overview of your team's engineering health"
      />

      <main className="flex-1 p-6 space-y-6">
        {/* DORA KPI Cards row */}
        <DoraKPICards />

        {/* Middle row: Health Score + Risk Meter + Quick Insights */}
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-4">
            <HealthScoreWidget />
          </div>
          <div className="col-span-4">
            <DeploymentRiskMeter />
          </div>
          <div className="col-span-4">
            <QuickInsights />
          </div>
        </div>

        {/* Bottom row: Velocity Sparklines + Activity Stream */}
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-8">
            <SparklineChart />
          </div>
          <div className="col-span-4">
            <ActivityStream />
          </div>
        </div>
      </main>
    </div>
  );
}
