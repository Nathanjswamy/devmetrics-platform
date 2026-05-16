import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, GitMerge, Clock } from 'lucide-react';

const RANK_COLORS = ['#F59E0B', '#94A3B8', '#CD7C2F', '#64748B', '#64748B', '#64748B'];
const RANK_LABELS = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

function getRoleColor(role) {
  if (!role) return { bg: '#EEF2FF', text: '#3730A3' };
  const r = role.toLowerCase();
  if (r.includes('front')) return { bg: '#F0FDFF', text: '#164E63' };
  if (r.includes('back')) return { bg: '#F5F3FF', text: '#4C1D95' };
  return { bg: '#ECFDF5', text: '#065F46' };
}

function InitialAvatar({ name, rank }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';
  const hue = (name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 relative"
      style={{ background: `hsl(${hue}, 65%, 50%)` }}
    >
      {initials}
      {rank < 3 && (
        <div
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black"
          style={{ background: RANK_COLORS[rank], color: '#fff', border: '1.5px solid #fff' }}
        >
          {rank + 1}
        </div>
      )}
    </div>
  );
}

export function LeaderboardTable({ developers = [] }) {
  if (!developers.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: '#FEF3C7' }}
          >
            <Trophy className="w-4 h-4" style={{ color: '#D97706' }} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: '#0F172A' }}>Developer Leaderboard</h3>
            <p className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>Ranked by PRs merged · Last 30 days</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="space-y-2">
        {developers.map((dev, idx) => {
          const roleStyle = getRoleColor(dev.role);
          const isGoodLeadTime = dev.avg_lead_time < 48;
          return (
            <motion.div
              key={dev.id || idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{
                background: idx === 0 ? 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' : '#F8FAFF',
                border: idx === 0 ? '1px solid #FDE68A' : '1px solid #F1F5F9',
              }}
            >
              {/* Rank */}
              <span
                className="text-xs font-black w-6 text-center shrink-0"
                style={{ color: RANK_COLORS[idx] || '#94A3B8' }}
              >
                {RANK_LABELS[idx] || `${idx + 1}`}
              </span>

              <InitialAvatar name={dev.name} rank={idx} />

              {/* Name + role */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: '#0F172A' }}>{dev.name}</p>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: roleStyle.bg, color: roleStyle.text }}
                >
                  {dev.role}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center">
                  <p className="text-xs font-black" style={{ color: '#4F46E5' }}>{dev.pr_count}</p>
                  <p className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: '#94A3B8' }}>PRs</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-0.5">
                    {isGoodLeadTime
                      ? <TrendingDown className="w-3 h-3" style={{ color: '#059669' }} />
                      : <TrendingUp className="w-3 h-3" style={{ color: '#DC2626' }} />
                    }
                    <p
                      className="text-xs font-black"
                      style={{ color: isGoodLeadTime ? '#059669' : '#DC2626' }}
                    >
                      {dev.avg_lead_time ? `${Math.round(dev.avg_lead_time)}h` : 'N/A'}
                    </p>
                  </div>
                  <p className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: '#94A3B8' }}>Lead</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
