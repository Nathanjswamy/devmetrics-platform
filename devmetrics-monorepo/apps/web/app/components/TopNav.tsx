"use client";

import { Search, RefreshCw, Calendar, ChevronDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 h-14"
      style={{
        background: "rgba(248, 246, 241, 0.85)",
        borderBottom: "2px solid var(--text-primary)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Left: Page title */}
      <div>
        <h1 className="text-base font-extrabold tracking-widest uppercase text-text-primary">{title}</h1>
        {subtitle && <p className="text-[11px] font-medium text-text-secondary mt-0.5">{subtitle}</p>}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-text-muted cursor-pointer transition-all duration-200 hover:border-border-bright"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            width: "200px",
          }}
        >
          <Search size={13} />
          <span>Search...</span>
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded border border-border font-mono">
            ⌘K
          </span>
        </div>

        {/* Date range */}
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary transition-all duration-200 hover:text-text-primary hover:bg-surface-3"
          style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
        >
          <Calendar size={13} />
          <span>Last 30 days</span>
          <ChevronDown size={11} />
        </button>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted transition-all duration-200 hover:text-text-primary hover:bg-surface-3"
          style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
          title="Refresh data"
        >
          <RefreshCw size={13} className={isRefreshing ? "animate-spin text-indigo-400" : ""} />
        </button>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <div className="status-dot-green w-1.5 h-1.5" />
          <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wide">Live</span>
        </div>
      </div>
    </header>
  );
}
