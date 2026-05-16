import React from 'react';
import { motion } from 'framer-motion';
import { GitMerge, CheckCircle2 } from 'lucide-react';

export function ActivityFeed({ feed = [] }) {
  return (
    <div className="card p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: '#10B981', boxShadow: '0 0 8px rgba(16,185,129,0.8)' }}
        />
        <h3 className="font-bold text-sm" style={{ color: '#0F172A' }}>
          Live Team Activity
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-0 pr-1">
        {feed.length === 0 && (
          <p className="text-xs text-center py-8" style={{ color: '#94A3B8' }}>
            No recent activity
          </p>
        )}
        {feed.map((item, idx) => {
          const isPR = item.type === 'pr';
          const Icon = isPR ? GitMerge : CheckCircle2;
          const iconColor = isPR ? '#7C3AED' : '#059669';
          const iconBg = isPR ? '#F5F3FF' : '#ECFDF5';
          const accentColor = isPR ? '#7C3AED' : '#059669';

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.3 }}
              className="flex gap-3 relative py-2.5"
              style={{ borderBottom: idx < feed.length - 1 ? '1px solid #F1F5F9' : 'none' }}
            >
              {/* Timeline dot */}
              <div
                className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center"
                style={{ background: iconBg }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} strokeWidth={2.5} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold leading-snug" style={{ color: '#1E293B' }}>
                  <span style={{ color: accentColor }}>{item.developer?.name || 'Unknown'}</span>
                  {' '}{isPR ? 'merged a PR' : 'closed an issue'}
                </p>
                <p
                  className="text-[11px] mt-0.5 truncate"
                  style={{ color: '#64748B' }}
                  title={item.title}
                >
                  {item.title}
                </p>
                <p className="text-[10px] mt-1 font-medium uppercase tracking-wider" style={{ color: '#CBD5E1' }}>
                  {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
