"use client";

import { Search, RefreshCw, ChevronDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UserAccountMenu } from "./UserAccountMenu";

interface TopNavProps {
  title: string;
  subtitle?: string;
}

export function TopNav({ title, subtitle }: TopNavProps) {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 h-14"
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Left: page title */}
      <div>
        <h1
          className="text-base font-semibold"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs cursor-pointer transition-colors"
          style={{
            width: "200px",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
        >
          <Search size={12} />
          <span>Search…</span>
          <kbd
            className="ml-auto text-[10px] px-1.5 py-0.5 rounded font-mono"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Date range */}
        <button
          className="btn-ghost text-xs"
        >
          <span>Last 30 days</span>
          <ChevronDown size={12} />
        </button>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="btn-ghost px-2 py-1.5"
          title="Refresh data"
        >
          <RefreshCw
            size={13}
            className={isRefreshing ? "animate-spin" : ""}
            style={{ color: isRefreshing ? "var(--accent-blue)" : "var(--text-muted)" }}
          />
        </button>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 pl-1">
          <div className="status-dot-green" />
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Live
          </span>
        </div>

        <div className="h-5 w-px mx-1" style={{ background: "var(--border)" }} />

        <UserAccountMenu />
      </div>
    </header>
  );
}
