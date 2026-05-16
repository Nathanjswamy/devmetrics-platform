import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F8',
          borderRadius: '12px',
          padding: '10px 14px',
          boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        }}
      >
        <p className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-6 mb-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
              <span className="text-xs font-medium" style={{ color: '#1E293B' }}>
                {entry.name === 'prs_merged' ? 'PRs Merged' : entry.name === 'deployments' ? 'Deployments' : 'Bugs'}
              </span>
            </div>
            <span className="text-xs font-bold" style={{ color: entry.color }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function TrendChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card p-6 h-[360px] flex flex-col"
    >
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="font-bold text-sm" style={{ color: '#0F172A' }}>Engineering Momentum</h3>
          <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
            Deployments · PRs Merged · Bugs — Last 14 Days
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-semibold">
          <span className="flex items-center gap-1.5" style={{ color: '#4F46E5' }}>
            <span className="inline-block w-3 h-0.5 rounded-full" style={{ background: '#4F46E5' }} />
            Deploys
          </span>
          <span className="flex items-center gap-1.5" style={{ color: '#7C3AED' }}>
            <span className="inline-block w-3 h-0.5 rounded-full" style={{ background: '#7C3AED' }} />
            PRs
          </span>
          <span className="flex items-center gap-1.5" style={{ color: '#DC2626' }}>
            <span className="inline-block w-3 h-0.5 rounded-full" style={{ background: '#DC2626' }} />
            Bugs
          </span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="gDeploy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gPrs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gBugs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DC2626" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#DC2626" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#CBD5E1"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => {
                const d = new Date(val);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
            />
            <YAxis stroke="#CBD5E1" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E2E8F8', strokeWidth: 1 }} />
            <Area type="monotone" dataKey="deployments" stroke="#4F46E5" strokeWidth={2} fill="url(#gDeploy)" dot={false} activeDot={{ r: 4, fill: '#4F46E5' }} />
            <Area type="monotone" dataKey="prs_merged" stroke="#7C3AED" strokeWidth={2} fill="url(#gPrs)" dot={false} activeDot={{ r: 4, fill: '#7C3AED' }} />
            <Area type="monotone" dataKey="bugs_reported" stroke="#DC2626" strokeWidth={2} fill="url(#gBugs)" dot={false} activeDot={{ r: 4, fill: '#DC2626' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
