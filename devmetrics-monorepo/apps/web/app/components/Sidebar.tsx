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
      { href: "/",               label: "Dashboard",      icon: LayoutDashboard },
      { href: "/recommendations",label: "Recommendations", icon: Sparkles },
      { href: "/intelligence",   label: "AI Intelligence", icon: Brain },
      { href: "/activity",       label: "Live Activity",   icon: Activity },
    ],
  },
  {
    section: "Engineering",
    items: [
      { href: "/reviews",     label: "Code Review",  icon: GitPullRequest },
      { href: "/leaderboard", label: "Leaderboard",  icon: Users },
      { href: "/analytics",   label: "Analytics",    icon: BarChart3 },
    ],
  },
  {
    section: "System",
    items: [
      { href: "/integrations", label: "Integrations", icon: Zap },
      { href: "/settings",     label: "Settings",     icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-56 flex flex-col z-40"
      style={{
        background: "#000000",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Brand */}
      <div
        className="h-14 flex items-center px-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <BrandLogo iconOnly={true} size="md" href="/dashboard" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {navItems.map((section) => (
          <div key={section.section}>
            <div className="px-3 mb-2">
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "var(--smoke)",
                  textTransform: "uppercase",
                  letterSpacing: "0.10em",
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
                      <Icon
                        size={14}
                        style={{ color: isActive ? "var(--plum)" : "inherit", flexShrink: 0 }}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Operational status */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2">
          <div className="status-dot-green" />
          <span style={{ fontSize: "12px", color: "var(--smoke)", letterSpacing: "0.021em" }}>
            All systems operational
          </span>
        </div>
      </div>
    </aside>
  );
}
