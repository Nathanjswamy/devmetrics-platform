"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { 
  Settings, 
  CreditCard, 
  LogOut, 
  GitBranch as Github, 
  User as UserIcon,
  ChevronDown
} from "lucide-react";
import Link from "next/link";

export function UserAccountMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [supabase.auth]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  if (!user) return null;

  const metadata = user.user_metadata || {};
  const email = user.email || "";
  const name = metadata.full_name || metadata.name || `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() || "Developer";
  const avatarUrl = metadata.avatar_url;
  const githubUsername = metadata.github_username || metadata.preferred_username;

  const getInitials = (n: string) => {
    const cleanName = n.trim();
    if (!cleanName) return "U";
    const parts = cleanName.split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
    }
    return cleanName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full border border-border overflow-hidden bg-surface-2 flex items-center justify-center text-sm font-medium text-text-primary shadow-sm">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={name} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                // Fallback to initials if image fails
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerText = getInitials(name);
              }}
            />
          ) : (
            <span>{getInitials(name)}</span>
          )}
        </div>
        <ChevronDown size={14} className="text-text-muted hidden sm:block" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ transformOrigin: "top right" }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-text-primary truncate">{name}</p>
            <p className="text-xs text-text-muted truncate">{email}</p>
          </div>

          {/* GitHub Connection */}
          {githubUsername && (
            <div className="px-4 py-2 flex items-center gap-2 text-xs text-text-secondary bg-surface-2/50 border-b border-border">
              <Github size={12} />
              <span className="truncate">Connected as {githubUsername}</span>
            </div>
          )}

          {/* Menu Items */}
          <div className="py-1">
            <Link 
              href="/settings" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
            >
              <UserIcon size={16} className="text-text-muted" />
              Profile Settings
            </Link>
            <Link 
              href="/settings" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
            >
              <Settings size={16} className="text-text-muted" />
              Account Settings
            </Link>
            <button 
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors opacity-70 cursor-not-allowed"
              disabled
            >
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-text-muted" />
                Billing
              </div>
              <span className="text-[10px] bg-surface-3 px-1.5 py-0.5 rounded text-text-muted">Soon</span>
            </button>
          </div>

          <div className="border-t border-border py-1 mt-1">
            <button 
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              <LogOut size={16} />
              {isSigningOut ? "Signing Out..." : "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
