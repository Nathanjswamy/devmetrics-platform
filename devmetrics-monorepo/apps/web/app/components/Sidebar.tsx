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
      className="fixed left-0 top-0 h-screen w-56 flex flex-col z-40"
      style={{
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Brand */}
      <div
        className="h-14 flex items-center px-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <BrandLogo iconOnly={true} size="md" href="/dashboard" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
        {navItems.map((section) => (
          <div key={section.section}>
            <div className="px-2 mb-1">
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
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
                      <Icon size={15} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
        <div
          className="flex items-center gap-2 px-2 py-1.5 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <div className="status-dot-green" />
          <span>All systems operational</span>
        </div>
      </div>
    </aside>
  );
}
