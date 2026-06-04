"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Brain,
  GitPullRequest,
  Users,
  BarChart3,
  Zap,
  Settings,
  Bell,
  ChevronRight,
  Activity,
  Sparkles,
} from "lucide-react";

const navItems = [
  {
    section: "Overview",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/intelligence", label: "AI Intelligence", icon: Brain, badge: "5" },
      { href: "/activity", label: "Live Activity", icon: Activity },
    ],
  },
  {
    section: "Engineering",
    items: [
      { href: "/reviews", label: "Code Review", icon: GitPullRequest, badge: "6" },
      { href: "/leaderboard", label: "Leaderboard", icon: Users },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    section: "System",
    items: [
      { href: "/integrations", label: "Integrations", icon: Zap },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-60 flex flex-col z-40 bg-surface border-r border-border"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div
          className="w-8 h-8 rounded flex items-center justify-center bg-text-primary"
        >
          <Sparkles size={16} className="text-surface" />
        </div>
        <div>
          <div className="text-lg font-serif font-bold text-text-primary tracking-tight leading-none">DevMetrics</div>
          <div className="text-[10px] text-text-muted font-medium uppercase tracking-widest mt-0.5">
            Intelligence
          </div>
        </div>
      </div>

      {/* Org selector */}
      <div
        className="mx-4 mt-4 flex items-center justify-between p-2.5 rounded cursor-pointer transition-all duration-200 hover:bg-surface-3"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center">
            <span className="text-[10px] font-bold text-text-primary">AC</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-text-primary">Acme Corp</div>
            <div className="text-[10px] text-text-muted">Pro Plan</div>
          </div>
        </div>
        <ChevronRight size={12} className="text-text-muted" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navItems.map((section) => (
          <div key={section.section}>
            <div className="px-2 mb-2">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
                {section.section}
              </span>
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`sidebar-link ${isActive ? "active" : ""}`}
                    >
                      <Icon size={16} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                          style={{
                            background: isActive
                              ? "var(--text-primary)"
                              : "var(--surface-3)",
                            color: isActive ? "var(--surface)" : "var(--text-secondary)",
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <div
          className="flex items-center gap-3 p-2.5 rounded cursor-pointer transition-all duration-200 hover:bg-surface-3"
        >
          <div
            className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-surface bg-text-primary flex-shrink-0"
          >
            EM
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-text-primary truncate">Engineering Mgr</div>
            <div className="text-[10px] text-text-muted truncate">admin@acme.com</div>
          </div>
          <div className="flex-shrink-0 relative">
            <Bell size={14} className="text-text-muted" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-orange rounded-full" />
          </div>
        </div>
      </div>
    </aside>
  );
}
