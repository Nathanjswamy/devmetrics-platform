import React from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, Clock, AlertCircle, ChevronRight } from 'lucide-react';

function urgencyStyle(daysOpen) {
  if (daysOpen >= 5) return { bg: '#FEE2E2', text: '#991B1B', label: 'Stale' };
  if (daysOpen >= 2) return { bg: '#FEF3C7', text: '#92400E', label: 'Aging' };
  return { bg: '#D1FAE5', text: '#065F46', label: 'Fresh' };
}

function sizeLabel(lines) {
  if (lines >= 500) return { label: 'XL', color: '#DC2626' };
  if (lines >= 200) return { label: 'L', color: '#D97706' };
  if (lines >= 50) return { label: 'M', color: '#4F46E5' };
  return { label: 'S', color: '#059669' };
}

export function ReviewQueue({ prs = [] }) {
  if (!prs.length) {
    return (
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#EEF2FF' }}>
            <GitPullRequest className="w-4 h-4" style={{ color: '#4F46E5' }} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: '#0F172A' }}>Code Review Queue</h3>
            <p className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>Awaiting review</p>
          </div>
        </div>
        <div className="py-8 text-center">
          <p className="text-xs" style={{ color: '#94A3B8' }}>🎉 No open PRs — queue is clear!</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="card p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#EEF2FF' }}>
            <GitPullRequest className="w-4 h-4" style={{ color: '#4F46E5' }} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: '#0F172A' }}>Code Review Queue</h3>
            <p className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>
              {prs.length} PR{prs.length !== 1 ? 's' : ''} awaiting review
            </p>
          </div>
        </div>
        {prs.some(p => p.days_open >= 5) && (
          <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#FEE2E2', color: '#991B1B' }}>
            <AlertCircle className="w-3 h-3" />
            {prs.filter(p => p.days_open >= 5).length} stale
          </div>
        )}
      </div>

      {/* PR List */}
      <div className="space-y-2">
        {prs.slice(0, 6).map((pr, idx) => {
          const urg = urgencyStyle(pr.days_open || 0);
          const sz = sizeLabel(pr.size || 0);
          return (
            <motion.div
              key={pr.id || idx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer group"
              style={{ background: '#F8FAFF', border: '1px solid #F1F5F9' }}
            >
              {/* Size badge */}
              <div
                className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-black"
                style={{ background: `${sz.color}15`, color: sz.color }}
              >
                {sz.label}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: '#1E293B' }} title={pr.title}>
                  {pr.title}
                </p>
                <p className="text-[10px] mt-0.5 font-medium" style={{ color: '#94A3B8' }}>
                  {pr.developer_name} · {pr.size} lines
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" style={{ color: urg.text }} />
                  <span className="text-[10px] font-bold" style={{ background: urg.bg, color: urg.text, padding: '2px 6px', borderRadius: '999px' }}>
                    {pr.days_open}d · {urg.label}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#94A3B8' }} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
