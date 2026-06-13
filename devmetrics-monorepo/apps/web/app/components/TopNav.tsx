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
    setTimeout(() => setIsRefreshing(false), 700);
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-8 h-14"
      style={{
        background: "rgba(17, 13, 14, 0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Left: title */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="font-serif font-bold text-base" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] mt-0.5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer"
          style={{
            width: "200px",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
        >
          <Search size={12} />
          <span>Search…</span>
          <span
            className="ml-auto text-[10px] px-1.5 py-0.5 rounded font-mono"
            style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            ⌘K
          </span>
        </div>

        {/* Date range */}
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <span>Last 30 days</span>
          <ChevronDown size={11} />
        </button>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center w-8 h-8 rounded-md transition-all"
          title="Refresh all data"
          style={{
            background: isRefreshing ? "var(--accent-maroon-dim)" : "var(--surface-2)",
            border: `1px solid ${isRefreshing ? "var(--accent-maroon)" : "var(--border)"}`,
          }}
        >
          <RefreshCw
            size={13}
            className={isRefreshing ? "animate-spin" : ""}
            style={{ color: isRefreshing ? "var(--accent-maroon-light)" : "var(--text-muted)" }}
          />
        </button>

        {/* Live badge */}
        <div className="flex items-center gap-1.5 px-2">
          <div className="status-dot-green" />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Live
          </span>
        </div>

        <div className="h-5 w-px" style={{ background: "var(--border)" }} />

        <UserAccountMenu />
      </div>
    </header>
  );
}
