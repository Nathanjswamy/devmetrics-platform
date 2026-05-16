import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/analytics');
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        console.error('Failed to fetch analytics data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return <div className="p-8 max-w-[1200px] mx-auto"><div className="h-64 skeleton rounded-2xl" /></div>;
  }

  const { sprintCompare, bugsBySeverity, leadTimeDistribution } = data;

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
        style={{ paddingBottom: '24px', borderBottom: '1px solid #E2E8F8' }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#ECFEFF' }}>
            <BarChart3 className="w-5 h-5" style={{ color: '#0891B2' }} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl" style={{ color: '#0F172A', letterSpacing: '-0.04em' }}>
              Advanced Analytics
            </h1>
            <p className="text-sm" style={{ color: '#64748B' }}>
              Deep dive into sprint-over-sprint comparisons and distributions.
            </p>
          </div>
        </div>
      </motion.header>

      {/* Sprint Compare */}
      <section className="mb-8">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>Sprint Comparison (Last 15 days vs Previous 15 days)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#64748B' }}>Avg Lead Time</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black" style={{ color: '#0F172A' }}>{sprintCompare.s2_lead_time}h</span>
              <span className="text-sm font-semibold" style={{ color: sprintCompare.s2_lead_time > sprintCompare.s1_lead_time ? '#DC2626' : '#059669' }}>
                vs {sprintCompare.s1_lead_time}h
              </span>
            </div>
          </div>
          <div className="card p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#64748B' }}>Deployments</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black" style={{ color: '#0F172A' }}>{sprintCompare.s2_deploys}</span>
              <span className="text-sm font-semibold" style={{ color: sprintCompare.s2_deploys < sprintCompare.s1_deploys ? '#DC2626' : '#059669' }}>
                vs {sprintCompare.s1_deploys}
              </span>
            </div>
          </div>
          <div className="card p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#64748B' }}>Bugs Reported</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black" style={{ color: '#0F172A' }}>{sprintCompare.s2_bugs}</span>
              <span className="text-sm font-semibold" style={{ color: sprintCompare.s2_bugs > sprintCompare.s1_bugs ? '#DC2626' : '#059669' }}>
                vs {sprintCompare.s1_bugs}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
           <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>Bugs by Severity</h2>
           <div className="card p-5 space-y-4">
             {bugsBySeverity.map(b => (
               <div key={b.severity} className="flex items-center justify-between">
                 <span className="text-sm font-bold uppercase" style={{ color: '#1E293B' }}>{b.severity}</span>
                 <span className="text-sm font-bold" style={{ color: '#64748B' }}>{b.count}</span>
               </div>
             ))}
           </div>
        </section>
        <section>
           <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>Lead Time Distribution</h2>
           <div className="card p-5 space-y-4">
             {leadTimeDistribution.map(d => (
               <div key={d.bucket} className="flex items-center justify-between">
                 <span className="text-sm font-bold" style={{ color: '#1E293B' }}>{d.bucket}</span>
                 <span className="text-sm font-bold" style={{ color: '#64748B' }}>{d.count} PRs</span>
               </div>
             ))}
           </div>
        </section>
      </div>

    </div>
  );
}
