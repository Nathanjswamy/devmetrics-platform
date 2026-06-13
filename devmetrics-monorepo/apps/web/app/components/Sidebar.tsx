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
  Activity,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";

const navItems = [
  {
    section: "Overview",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/recommendations", label: "Recommendations", icon: Sparkles },
      { href: "/intelligence", label: "AI Intelligence", icon: Brain },
      { href: "/activity", label: "Live Activity", icon: Activity },
    ],
  },
  {
    section: "Engineering",
    items: [
      { href: "/reviews", label: "Code Review", icon: GitPullRequest },
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
      className="fixed left-0 top-0 h-screen w-60 flex flex-col z-40"
      style={{
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Brand */}
      <div className="h-14 flex items-center px-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <BrandLogo iconOnly={true} size="md" href="/dashboard" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {navItems.map((section) => (
          <div key={section.section}>
            <div className="px-2 mb-1.5">
              <span
                className="text-[9px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "var(--text-muted)" }}
              >
                {section.section}
              </span>
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={`sidebar-link ${isActive ? "active" : ""}`}>
                      <Icon size={14} style={{ flexShrink: 0 }} />
                      <span className="flex-1 text-[13px]">{item.label}</span>
                      {isActive && (
                        <ChevronRight size={11} style={{ color: "var(--accent-maroon-light)", opacity: 0.7 }} />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer badge */}
      <div className="p-4" style={{ borderTop: "1px solid var(--border)" }}>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-md text-xs"
          style={{ background: "var(--accent-maroon-dim)", border: "1px solid rgba(139,26,42,0.25)" }}
        >
          <div className="status-dot-green" />
          <span style={{ color: "var(--text-secondary)" }}>All systems operational</span>
        </div>
      </div>
    </aside>
  );
}
