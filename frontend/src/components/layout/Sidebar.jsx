import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Users, Settings, BarChart3, GitPullRequest, Zap, ShieldAlert } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Command Center', path: '/dashboard' },
  { icon: ShieldAlert, label: 'Resolution Center', path: '/resolution-center' },
  { icon: Activity, label: 'Live Activity', path: '/activity' },
  { icon: Users, label: 'Engineering Team', path: '/team' },
  { icon: GitPullRequest, label: 'Review Queue', path: '/review-queue' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Platform Config', path: '/config' },
];

export function Sidebar() {
  return (
    <aside
      className="w-64 hidden md:flex flex-col h-screen sticky left-0 top-0 sidebar z-30"
      style={{
        background: '#FFFFFF',
        borderRight: '1px solid #E2E8F8',
        boxShadow: '2px 0 12px rgba(15,23,42,0.04)',
      }}
    >
      {/* Brand */}
      <div className="p-6 pb-5" style={{ borderBottom: '1px solid #E2E8F8' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              boxShadow: '0 4px 12px rgba(79,70,229,0.35)',
            }}
          >
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span
              className="font-extrabold text-base tracking-tight"
              style={{ color: '#0F172A', letterSpacing: '-0.03em' }}
            >
              DevMetrics
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#94A3B8', marginTop: '-1px' }}>
              Intelligence Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#CBD5E1' }}>
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${isActive ? 'active-nav-link' : 'inactive-nav-link'}`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)',
                      color: '#4F46E5',
                      fontWeight: 600,
                      border: '1px solid rgba(79,70,229,0.15)',
                      boxShadow: '0 2px 8px rgba(79,70,229,0.1)',
                    }
                  : {
                      color: '#64748B',
                      fontWeight: 500,
                      border: '1px solid transparent',
                    }
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="w-4 h-4 shrink-0"
                    style={{ color: isActive ? '#4F46E5' : '#94A3B8' }}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="text-sm">{item.label}</span>
                  {isActive && (
                    <div
                      className="w-1.5 h-1.5 rounded-full ml-auto"
                      style={{ background: '#4F46E5', boxShadow: '0 0 6px rgba(79,70,229,0.8)' }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-4" style={{ borderTop: '1px solid #E2E8F8' }}>
        <div
          className="rounded-xl p-3"
          style={{ background: '#F8FAFF', border: '1px solid #E2E8F8' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.8)' }}
            />
            <span className="text-xs font-semibold" style={{ color: '#059669' }}>
              All Systems Operational
            </span>
          </div>
          <p className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>
            API · v2.4.1 · Live Data
          </p>
        </div>
      </div>
    </aside>
  );
}
