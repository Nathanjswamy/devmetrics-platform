import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { getDashboardData } from '../utils/api';

import { MetricCard } from '../components/MetricCard';
import { InsightAlert, RecommendationCard } from '../components/InsightAlert';
import { TrendChart } from '../components/charts/TrendChart';
import { ActivityFeed } from '../components/ActivityFeed';
import { SlidingPanel } from '../components/layout/SlidingPanel';
import { DashboardSkeleton } from '../components/layout/DashboardSkeleton';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { ReviewQueue } from '../components/ReviewQueue';
import { DeploymentRisk } from '../components/DeploymentRisk';

import {
  RefreshCw, GitPullRequest, Bug, GitCommit, CheckCircle2,
  Sparkles, Clock, Rocket, Package
} from 'lucide-react';

const API = 'http://localhost:5000/api';

// ── Panel detail renderers ──────────────────────────────────────────────────
function PRRow({ pr, showLeadTime = false }) {
  const isLong = showLeadTime && pr.lead_time_hours > 48;
  return (
    <div
      className="flex gap-3 items-start p-3 rounded-xl mb-2"
      style={{ background: '#F8FAFF', border: '1px solid #F1F5F9' }}
    >
      <div
        className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center"
        style={{ background: '#EEF2FF' }}
      >
        <GitPullRequest className="w-4 h-4" style={{ color: '#4F46E5' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: '#1E293B' }} title={pr.title}>{pr.title}</p>
        <div className="flex flex-wrap gap-3 mt-1">
          <span className="text-xs font-medium" style={{ color: '#64748B' }}>
            By <span style={{ color: '#4F46E5' }}>{pr.developer_name}</span>
          </span>
          <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>{pr.size} lines</span>
          {showLeadTime && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                background: isLong ? '#FEE2E2' : '#D1FAE5',
                color: isLong ? '#991B1B' : '#065F46',
              }}
            >
              {pr.lead_time_hours}h lead time
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function IssueRow({ issue }) {
  const isSlow = issue.cycle_time_hours > 120;
  return (
    <div
      className="flex gap-3 items-start p-3 rounded-xl mb-2"
      style={{ background: '#F8FAFF', border: '1px solid #F1F5F9' }}
    >
      <div className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center" style={{ background: '#F5F3FF' }}>
        <CheckCircle2 className="w-4 h-4" style={{ color: '#7C3AED' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: '#1E293B' }}>{issue.title}</p>
        <div className="flex flex-wrap gap-3 mt-1">
          <span className="text-xs font-medium" style={{ color: '#64748B' }}>
            By <span style={{ color: '#7C3AED' }}>{issue.developer_name}</span>
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: isSlow ? '#FEF3C7' : '#D1FAE5',
              color: isSlow ? '#92400E' : '#065F46',
            }}
          >
            {issue.cycle_time_hours}h cycle
          </span>
        </div>
      </div>
    </div>
  );
}

function DeployRow({ deploy }) {
  const isSuccess = deploy.status === 'success';
  return (
    <div
      className="flex gap-3 items-center p-3 rounded-xl mb-2"
      style={{ background: '#F8FAFF', border: '1px solid #F1F5F9' }}
    >
      <div
        className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center"
        style={{ background: isSuccess ? '#D1FAE5' : '#FEE2E2' }}
      >
        <Rocket className="w-4 h-4" style={{ color: isSuccess ? '#059669' : '#DC2626' }} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold" style={{ color: '#1E293B' }}>{deploy.version}</p>
        <p className="text-xs" style={{ color: '#94A3B8' }}>
          {new Date(deploy.deployed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          {' · '}{deploy.pr_count} PRs shipped
        </p>
      </div>
      <span
        className="text-xs font-bold px-2 py-0.5 rounded-full"
        style={{
          background: isSuccess ? '#D1FAE5' : '#FEE2E2',
          color: isSuccess ? '#065F46' : '#991B1B',
        }}
      >
        {deploy.status}
      </span>
    </div>
  );
}

function BugRow({ bug }) {
  const sevColor = {
    critical: { bg: '#FEE2E2', text: '#991B1B' },
    high: { bg: '#FEE2E2', text: '#DC2626' },
    medium: { bg: '#FEF3C7', text: '#92400E' },
    low: { bg: '#D1FAE5', text: '#065F46' },
  }[bug.severity] || { bg: '#F1F5F9', text: '#475569' };

  return (
    <div
      className="flex gap-3 items-start p-3 rounded-xl mb-2"
      style={{ background: '#F8FAFF', border: '1px solid #F1F5F9' }}
    >
      <div className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center" style={{ background: '#FEE2E2' }}>
        <Bug className="w-4 h-4" style={{ color: '#DC2626' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: '#1E293B' }}>{bug.title}</p>
        <div className="flex flex-wrap gap-3 mt-1">
          {bug.deployment_version && (
            <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>
              <Package className="w-3 h-3 inline mr-0.5" />{bug.deployment_version}
            </span>
          )}
          <span
            className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
            style={{ background: sevColor.bg, color: sevColor.text }}
          >
            {bug.severity}
          </span>
          <span className="text-xs" style={{ color: '#94A3B8' }}>
            {new Date(bug.reported_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Health Score Ring ───────────────────────────────────────────────────────
function HealthRing({ score }) {
  const color = score >= 80 ? '#059669' : score >= 60 ? '#D97706' : '#DC2626';
  const glow = score >= 80 ? 'rgba(5,150,105,0.3)' : score >= 60 ? 'rgba(217,119,6,0.3)' : 'rgba(220,38,38,0.3)';
  const r = 30, cx = 38, cy = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="flex items-center gap-3">
      <div className="relative" style={{ width: 76, height: 76 }}>
        <svg width="76" height="76" viewBox="0 0 76 76">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth="7" />
          <motion.circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            transform="rotate(-90 38 38)"
            style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
          />
          <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={color} fontFamily="Plus Jakarta Sans, system-ui">
            {score}
          </text>
        </svg>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#94A3B8' }}>Workflow Health</p>
        <p className="text-lg font-extrabold" style={{ color, letterSpacing: '-0.03em' }}>
          {score >= 80 ? 'Healthy' : score >= 60 ? 'Degraded' : 'Critical'}
        </p>
      </div>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [panelState, setPanelState] = useState({ isOpen: false, type: null, title: '', data: [] });
  const [panelLoading, setPanelLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, lbRes, rqRes] = await Promise.all([
        getDashboardData(),
        axios.get(`${API}/leaderboard`),
        axios.get(`${API}/review-queue`),
      ]);
      if (dashRes.success) setData(dashRes.data);
      if (lbRes.data.success) setLeaderboard(lbRes.data.data);
      if (rqRes.data.success) setReviewQueue(rqRes.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openPanel = async (type, title) => {
    setPanelState({ isOpen: true, type, title, data: [] });
    setPanelLoading(true);
    try {
      const res = await axios.get(`${API}/details/${type}`);
      if (res.data.success) setPanelState(prev => ({ ...prev, data: res.data.data }));
    } catch (err) {
      console.error('Failed to load details', err);
    } finally {
      setPanelLoading(false);
    }
  };

  const closePanel = () => setPanelState(prev => ({ ...prev, isOpen: false }));

  const renderPanelContent = () => {
    if (panelLoading) {
      return (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-16 rounded-xl skeleton" style={{
              background: 'linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }} />
          ))}
        </div>
      );
    }

    if (!panelState.data || panelState.data.length === 0) {
      return (
        <div className="py-16 text-center">
          <p style={{ color: '#94A3B8' }} className="text-sm">No data available for this metric.</p>
        </div>
      );
    }

    const { type, data: rows } = panelState;

    if (type === 'leadTime' || type === 'prThroughput') {
      return rows.map((pr, i) => <PRRow key={i} pr={pr} showLeadTime={type === 'leadTime'} />);
    }
    if (type === 'cycleTime') {
      return rows.map((issue, i) => <IssueRow key={i} issue={issue} />);
    }
    if (type === 'deploymentFreq') {
      return rows.map((deploy, i) => <DeployRow key={i} deploy={deploy} />);
    }
    if (type === 'bugRate') {
      return rows.map((bug, i) => <BugRow key={i} bug={bug} />);
    }
    return null;
  };

  if (loading && !data) return <DashboardSkeleton />;

  const { metrics, trendData, intelligence, activityFeed } = data;

  return (
    <div className="p-6 md:p-8 max-w-[1500px] mx-auto">

      {/* ── Page Header ─────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        style={{ paddingBottom: '24px', borderBottom: '1px solid #E2E8F8' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#4F46E5', boxShadow: '0 0 8px rgba(79,70,229,0.8)' }}
            />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#94A3B8' }}>
              System Status · Live
            </span>
          </div>
          <h1
            className="font-extrabold mb-1"
            style={{ fontSize: '2rem', color: '#0F172A', letterSpacing: '-0.04em', lineHeight: 1.1 }}
          >
            Engineering Intelligence
          </h1>
          <p className="text-sm" style={{ color: '#64748B' }}>
            Real-time workflow health · bottleneck detection · actionable insights
          </p>
        </div>

        <div className="flex items-center gap-4">
          <HealthRing score={intelligence.healthScore} />
          <button
            onClick={loadData}
            className="p-2 rounded-xl border transition-all"
            style={{
              background: loading ? '#EEF2FF' : '#F8FAFF',
              border: '1px solid #E2E8F8',
              color: '#64748B',
            }}
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} style={{ color: '#4F46E5' }} />
          </button>
        </div>
      </motion.header>

      {/* ── Row 1: AI Insights + Recommendations ───────────── */}
      <section className="mb-8">
        <h2 className="section-label mb-4">Active Bottlenecks &amp; Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {intelligence.insights.map((insight, idx) => (
            <InsightAlert key={`insight-${idx}`} insight={insight} index={idx} />
          ))}
          {intelligence.recommendations.map((rec, idx) => (
            <RecommendationCard key={`rec-${idx}`} rec={rec} index={idx + intelligence.insights.length} />
          ))}
          {intelligence.insights.length === 0 && intelligence.recommendations.length === 0 && (
            <div
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}
            >
              <CheckCircle2 className="w-5 h-5" style={{ color: '#059669' }} />
              <p className="text-sm font-semibold" style={{ color: '#065F46' }}>
                Workflow is entirely healthy. No active bottlenecks.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Row 2: Core Metric Cards ────────────────────────── */}
      <section className="mb-8">
        <h2 className="section-label mb-4">Core Productivity Metrics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { type: 'leadTime',       title: 'Lead Time',     value: metrics.leadTimeHours,       unit: 'hrs',      label: 'Lead Time Details' },
            { type: 'cycleTime',      title: 'Cycle Time',    value: metrics.cycleTimeHours,      unit: 'hrs',      label: 'Cycle Time Details' },
            { type: 'deploymentFreq', title: 'Deployments',   value: metrics.deploymentFrequency, unit: '/ 30d',    label: 'Deployment History' },
            { type: 'bugRate',        title: 'Bug Rate',      value: metrics.bugRatePercentage,   unit: '%',        label: 'Production Bugs' },
            { type: 'prThroughput',   title: 'PR Throughput', value: metrics.prThroughput,        unit: 'merged',   label: 'Merged Pull Requests' },
          ].map(({ type, title, value, unit, label }, idx) => (
            <div
              key={type}
              onClick={() => openPanel(type, label)}
              className="cursor-pointer h-full"
              title={`Click to view ${label}`}
            >
              <MetricCard title={title} value={value} unit={unit} type={type} index={idx} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Row 3: Trend Chart + Activity Feed ─────────────── */}
      <section className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="section-label mb-4">Engineering Momentum</h2>
            <TrendChart data={trendData} />
          </div>
          <div>
            <h2 className="section-label mb-4">Live Activity</h2>
            <div style={{ height: '360px' }}>
              <ActivityFeed feed={activityFeed} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Row 4: Leaderboard + Review Queue + Risk ────────── */}
      <section className="mb-8">
        <h2 className="section-label mb-4">Team Intelligence &amp; Operations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LeaderboardTable developers={leaderboard} />
          <ReviewQueue prs={reviewQueue} />
          <DeploymentRisk
            bugRate={metrics.bugRatePercentage}
            deployFreq={metrics.deploymentFrequency}
            leadTime={metrics.leadTimeHours}
          />
        </div>
      </section>

      {/* ── Sliding Detail Panel ─────────────────────────────── */}
      <SlidingPanel isOpen={panelState.isOpen} onClose={closePanel} title={panelState.title}>
        <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
        {renderPanelContent()}
      </SlidingPanel>
    </div>
  );
}
