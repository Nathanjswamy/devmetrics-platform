import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { getMetricIntelligence } from '../utils/metricIntelligence';

const metricAccent = {
  leadTime:      { color: '#4F46E5', bg: '#EEF2FF', light: '#F5F3FF', border: '#4F46E5' },
  cycleTime:     { color: '#7C3AED', bg: '#F5F3FF', light: '#FAF5FF', border: '#7C3AED' },
  deploymentFreq:{ color: '#0891B2', bg: '#ECFEFF', light: '#F0FDFF', border: '#0891B2' },
  bugRate:       { color: '#DC2626', bg: '#FEE2E2', light: '#FFF5F5', border: '#DC2626' },
  prThroughput:  { color: '#059669', bg: '#D1FAE5', light: '#ECFDF5', border: '#059669' },
};

const statusStyle = {
  success: { bg: '#D1FAE5', text: '#065F46' },
  warning: { bg: '#FEF3C7', text: '#92400E' },
  error:   { bg: '#FEE2E2', text: '#991B1B' },
  neutral: { bg: '#F1F5F9', text: '#475569' },
};

export function MetricCard({ title, value, unit, type, index }) {
  const intelligence = getMetricIntelligence(type, value);
  const accent = metricAccent[type] || metricAccent.leadTime;
  const ss = statusStyle[intelligence.status] || statusStyle.neutral;

  const isUp = intelligence.trend.startsWith('+');
  const isDown = intelligence.trend.startsWith('-');
  const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="card card-interactive flex flex-col h-full relative overflow-hidden group"
      style={{ borderLeft: `3px solid ${accent.border}` }}
    >
      {/* Neon hover shimmer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, ${accent.bg}80, transparent 70%)` }}
      />

      <div className="p-5 flex flex-col h-full relative z-10">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: '#94A3B8' }}
          >
            {title}
          </span>
          <span
            className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: ss.bg, color: ss.text }}
          >
            <TrendIcon className="w-3 h-3" />
            {intelligence.trend}
          </span>
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1.5 mb-1">
          <span
            className="font-extrabold tracking-tight"
            style={{ fontSize: '2.25rem', color: accent.color, letterSpacing: '-0.04em', lineHeight: 1 }}
          >
            {value}
          </span>
          <span className="text-sm font-semibold" style={{ color: '#94A3B8' }}>{unit}</span>
        </div>

        {/* Neon underline */}
        <div
          className="w-full h-px mb-4"
          style={{ background: `linear-gradient(to right, ${accent.color}30, transparent)` }}
        />

        {/* Interpretation */}
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: '#475569' }}>
          {intelligence.interpretation}
        </p>

        {/* Action */}
        <div
          className="flex items-start gap-2 pt-3 mt-auto"
          style={{ borderTop: '1px solid #F1F5F9' }}
        >
          <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accent.color }} />
          <p className="text-[11px] leading-relaxed" style={{ color: '#64748B' }}>
            <span className="font-semibold" style={{ color: '#1E293B' }}>Action: </span>
            {intelligence.recommendation}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
