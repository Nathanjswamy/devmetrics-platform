import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

function getRiskProfile(bugRate, deployFreq, leadTime) {
  let score = 0;
  // Bug rate contribution (0-40)
  if (bugRate > 20) score += 40;
  else if (bugRate > 10) score += 25;
  else if (bugRate > 5) score += 12;
  // Deploy frequency contribution (0-35)
  if (deployFreq < 2) score += 35;
  else if (deployFreq < 5) score += 20;
  else if (deployFreq < 8) score += 10;
  // Lead time contribution (0-25)
  if (leadTime > 96) score += 25;
  else if (leadTime > 48) score += 15;
  else if (leadTime > 24) score += 6;
  return Math.min(score, 100);
}

export function DeploymentRisk({ bugRate = 0, deployFreq = 0, leadTime = 0 }) {
  const risk = getRiskProfile(bugRate, deployFreq, leadTime);

  let color, label, bg, Icon, desc;
  if (risk >= 60) {
    color = '#DC2626'; bg = '#FEE2E2'; label = 'High Risk'; Icon = ShieldX;
    desc = 'Deployment risk is elevated. Recommend gate next release.';
  } else if (risk >= 30) {
    color = '#D97706'; bg = '#FEF3C7'; label = 'Moderate'; Icon = ShieldAlert;
    desc = 'Some risk factors detected. Monitor closely before shipping.';
  } else {
    color = '#059669'; bg = '#D1FAE5'; label = 'Low Risk'; Icon = ShieldCheck;
    desc = 'Workflow is stable. Deploy with confidence.';
  }

  // SVG gauge params
  const radius = 42;
  const cx = 60;
  const cy = 60;
  const circumference = Math.PI * radius; // half circle
  const dashOffset = circumference - (risk / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="card p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: bg }}>
          <Icon className="w-4 h-4" style={{ color }} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="font-bold text-sm" style={{ color: '#0F172A' }}>Deployment Risk</h3>
          <p className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>Composite risk score</p>
        </div>
      </div>

      {/* Gauge */}
      <div className="flex items-center gap-5">
        <div className="relative shrink-0" style={{ width: 120, height: 70 }}>
          <svg width="120" height="70" viewBox="0 0 120 70">
            {/* Track */}
            <path
              d={`M 9 60 A ${radius} ${radius} 0 0 1 111 60`}
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Fill */}
            <motion.path
              d={`M 9 60 A ${radius} ${radius} 0 0 1 111 60`}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
            />
            {/* Center score */}
            <text x="60" y="58" textAnchor="middle" fontSize="20" fontWeight="800" fill={color} fontFamily="Plus Jakarta Sans, system-ui">
              {risk}
            </text>
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <span
            className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full mb-2"
            style={{ background: bg, color }}
          >
            <Icon className="w-3 h-3" />
            {label}
          </span>
          <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{desc}</p>
        </div>
      </div>

      {/* Factor bars */}
      <div className="mt-4 space-y-2">
        {[
          { label: 'Bug Rate', value: Math.min(bugRate / 25 * 100, 100), raw: `${bugRate}%` },
          { label: 'Deploy Freq', value: Math.max(100 - (deployFreq / 15 * 100), 0), raw: `${deployFreq}/mo` },
          { label: 'Lead Time', value: Math.min(leadTime / 120 * 100, 100), raw: `${Math.round(leadTime)}h` },
        ].map(({ label, value, raw }) => {
          const barColor = value > 65 ? '#DC2626' : value > 35 ? '#D97706' : '#059669';
          return (
            <div key={label}>
              <div className="flex justify-between text-[10px] font-semibold mb-1" style={{ color: '#94A3B8' }}>
                <span>{label}</span><span style={{ color: '#64748B' }}>{raw}</span>
              </div>
              <div className="h-1.5 rounded-full w-full" style={{ background: '#F1F5F9' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: barColor, width: `${value}%`, maxWidth: '100%' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
