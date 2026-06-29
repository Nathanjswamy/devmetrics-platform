import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyMetricStateProps {
  message: string;
  icon?: LucideIcon;
  subtext?: string;
}

export function EmptyMetricState({ message, icon: Icon, subtext }: EmptyMetricStateProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px] p-6">
      {Icon && (
        <div className="mb-3 opacity-40">
          <Icon size={32} className="text-slate-500" />
        </div>
      )}
      <p className="text-sm text-slate-400 text-center font-medium max-w-sm">
        {message}
      </p>
      {subtext && (
        <p className="text-xs text-slate-500 text-center mt-2 max-w-sm">
          {subtext}
        </p>
      )}
    </div>
  );
}
