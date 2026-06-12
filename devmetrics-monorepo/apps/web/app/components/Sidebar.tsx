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
import { BrandLogo } from "./BrandLogo";

const navItems = [
  {
    section: "Overview",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/recommendations", label: "Recommendations", icon: Sparkles, badge: "3" },
      { href: "/intelligence", label: "AI Intelligence", icon: Brain },
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
      {/* Branding */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <BrandLogo iconOnly={true} size="md" href="/dashboard" />
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

      {/* Removed Fake User Profile */}
    </aside>
  );
}
