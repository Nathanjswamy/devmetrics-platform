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
        background: "#000000",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Page title */}
      <div>
        <h1
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--bone)",
            letterSpacing: "0.021em",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: "12px", color: "var(--smoke)", letterSpacing: "0.05em", marginTop: "1px" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">

        {/* Search — ghost pill */}
        <div
          className="flex items-center gap-2 cursor-pointer transition-colors"
          style={{
            width: "180px",
            padding: "0.375rem 0.875rem",
            borderRadius: "99px",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "var(--smoke)",
            fontSize: "13px",
            letterSpacing: "0.021em",
          }}
        >
          <Search size={12} />
          <span>Search…</span>
          <kbd
            style={{
              marginLeft: "auto",
              fontSize: "10px",
              padding: "1px 5px",
              borderRadius: "4px",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "var(--smoke)",
              background: "transparent",
              fontFamily: "inherit",
            }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Date range — ghost pill */}
        <button
          className="btn-ghost"
          style={{ textTransform: "none", letterSpacing: "0.021em", fontSize: "13px" }}
        >
          Last 30 days <ChevronDown size={11} />
        </button>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "34px",
            height: "34px",
            borderRadius: "99px",
            border: "1px solid rgba(255,255,255,0.10)",
            background: "transparent",
            cursor: "pointer",
            transition: "border-color 0.15s",
          }}
          title="Refresh data"
        >
          <RefreshCw
            size={13}
            className={isRefreshing ? "animate-spin" : ""}
            style={{ color: isRefreshing ? "var(--plum)" : "var(--smoke)" }}
          />
        </button>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 pl-1">
          <div className="status-dot-green" />
          <span style={{ fontSize: "12px", color: "var(--smoke)", letterSpacing: "0.05em" }}>LIVE</span>
        </div>

        <div style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.07)", margin: "0 4px" }} />

        <UserAccountMenu />
      </div>
    </header>
  );
}
