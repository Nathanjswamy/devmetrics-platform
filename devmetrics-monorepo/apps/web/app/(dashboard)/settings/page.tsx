"use client";
import { TopNav } from "../../components/TopNav";
import { User, Bell, Shield, CreditCard } from "lucide-react";

const sections = [
  { icon: User, label: "Profile", desc: "Manage your account details" },
  { icon: Bell, label: "Notifications", desc: "Configure alert preferences" },
  { icon: Shield, label: "Security", desc: "Authentication and access control" },
  { icon: CreditCard, label: "Billing", desc: "Subscription and usage" },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="Settings" subtitle="Configure DevMetrics for your organization" />
      <main className="flex-1 p-6">
        <div className="max-w-2xl space-y-3">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-surface-3"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(99,102,241,0.1)" }}>
                  <Icon size={17} className="text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">{s.label}</div>
                  <div className="text-xs text-text-muted">{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
