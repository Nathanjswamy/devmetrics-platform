import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, Lightbulb, ArrowRight, Zap } from 'lucide-react';

const typeConfig = {
  critical: {
    Icon: AlertCircle,
    border: '#DC2626',
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    titleColor: '#991B1B',
    labelBg: '#FEE2E2',
    labelText: '#991B1B',
    label: 'Critical',
  },
  warning: {
    Icon: AlertCircle,
    border: '#D97706',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    titleColor: '#92400E',
    labelBg: '#FEF3C7',
    labelText: '#92400E',
    label: 'Warning',
  },
  success: {
    Icon: CheckCircle2,
    border: '#059669',
    iconBg: '#D1FAE5',
    iconColor: '#059669',
    titleColor: '#065F46',
    labelBg: '#D1FAE5',
    labelText: '#065F46',
    label: 'Healthy',
  },
  info: {
    Icon: Info,
    border: '#4F46E5',
    iconBg: '#EEF2FF',
    iconColor: '#4F46E5',
    titleColor: '#3730A3',
    labelBg: '#EEF2FF',
    labelText: '#3730A3',
    label: 'Info',
  },
};

export function InsightAlert({ insight, index }) {
  const cfg = typeConfig[insight.type] || typeConfig.info;
  const Icon = cfg.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
      className="card relative overflow-hidden"
      style={{ borderLeft: `3px solid ${cfg.border}` }}
    >
      <div className="p-5">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center"
            style={{ background: cfg.iconBg }}
          >
            <Icon className="w-4 h-4" style={{ color: cfg.iconColor }} strokeWidth={2.5} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4
                className="font-bold text-sm tracking-tight"
                style={{ color: cfg.titleColor }}
              >
                {insight.title}
              </h4>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0"
                style={{ background: cfg.labelBg, color: cfg.labelText }}
              >
                {cfg.label}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>
              {insight.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function RecommendationCard({ rec, index }) {
  const [acting, setActing] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const impactColor = rec.impact === 'High'
    ? { bg: '#FEE2E2', text: '#991B1B' }
    : rec.impact === 'Medium'
    ? { bg: '#FEF3C7', text: '#92400E' }
    : { bg: '#D1FAE5', text: '#065F46' };

  const handleAction = (e) => {
    e.stopPropagation();
    setActing(true);
    setTimeout(() => {
      setActing(false);
      setDone(true);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
      className="card group cursor-pointer"
      style={{ borderLeft: '3px solid #4F46E5' }}
    >
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center"
            style={{ background: '#EEF2FF' }}
          >
            <Lightbulb className="w-4 h-4" style={{ color: '#4F46E5' }} strokeWidth={2.5} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-sm tracking-tight" style={{ color: '#1E293B' }}>
                {rec.title}
              </h4>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0"
                style={{ background: impactColor.bg, color: impactColor.text }}
              >
                {rec.impact} Impact
              </span>
            </div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: '#64748B' }}>
              {rec.description}
            </p>
            <button
              onClick={handleAction}
              disabled={acting || done}
              className="flex items-center gap-1 text-xs font-bold group-hover:gap-2 transition-all"
              style={{ color: done ? '#059669' : '#4F46E5', opacity: acting ? 0.7 : 1 }}
            >
              {acting ? 'Processing...' : done ? 'Workflow Started ✓' : 'Take Action'} 
              {!acting && !done && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
