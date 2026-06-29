import React from "react";
import { GitCommit, GitPullRequest, GitMerge } from "lucide-react";

const recentEvents = [
  {
    id: 1,
    type: "commit",
    message: "Pushed to main: update commit analytics chart",
    time: "10 mins ago",
    icon: GitCommit,
    color: "text-emerald-400"
  },
  {
    id: 2,
    type: "pr_open",
    message: "Opened Pull Request: feat/dashboard-layout",
    time: "2 hours ago",
    icon: GitPullRequest,
    color: "text-indigo-400"
  },
  {
    id: 3,
    type: "pr_merge",
    message: "Merged Pull Request: fix/login-bug",
    time: "5 hours ago",
    icon: GitMerge,
    color: "text-purple-400"
  }
];

export function RecentActivityFeed() {
  return (
    <div className="bg-slate-900 rounded-xl p-6 min-h-[300px] flex flex-col shadow-lg border border-slate-800">
      <h2 className="text-lg font-bold text-slate-100 mb-6">Recent Activity</h2>
      
      <div className="flex-1 flex flex-col gap-5">
        {recentEvents.map((event, idx) => {
          const Icon = event.icon;
          return (
            <div key={event.id} className="flex gap-4 items-start relative">
              {idx !== recentEvents.length - 1 && (
                <div className="absolute left-4 top-8 bottom-[-20px] w-px bg-slate-800 z-0" />
              )}
              
              <div className="relative z-10 w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                <Icon className={`w-4 h-4 ${event.color}`} />
              </div>
              
              <div className="flex-1 min-w-0 pt-1.5">
                <p className="text-sm font-medium text-slate-200 truncate">{event.message}</p>
                <p className="text-xs text-slate-500 mt-1">{event.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
