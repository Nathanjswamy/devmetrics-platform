"use client";

import { Search, RefreshCw, Calendar, ChevronDown } from "lucide-react";
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
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-bg border-b border-border"
    >
      {/* Left: Branding & Page title */}
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-xl font-serif font-bold text-text-primary">{title}</h1>
          {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs text-text-muted cursor-pointer transition-all duration-200 bg-surface border border-border hover:border-border-bright"
          style={{ width: "220px" }}
        >
          <Search size={13} />
          <span>Search...</span>
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded border border-border font-mono">
            ⌘K
          </span>
        </div>

        {/* Date range */}
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs text-text-secondary transition-all duration-200 hover:text-text-primary hover:bg-surface-2 bg-surface border border-border"
        >
          <Calendar size={13} />
          <span>Last 30 days</span>
          <ChevronDown size={11} />
        </button>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center w-8 h-8 rounded-sm text-text-muted transition-all duration-200 hover:text-text-primary hover:bg-surface-2 bg-surface border border-border"
          title="Refresh data"
        >
          <RefreshCw size={13} className={isRefreshing ? "animate-spin text-accent-green" : ""} />
        </button>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 ml-2 mr-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
          <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wide">Live</span>
        </div>
        
        <div className="h-6 w-px bg-border hidden sm:block"></div>
        
        <UserAccountMenu />
      </div>
    </header>
  );
}
