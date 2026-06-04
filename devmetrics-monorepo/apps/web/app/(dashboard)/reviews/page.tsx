"use client";
import { TopNav } from "../../components/TopNav";
import { Clock, MessageSquare, CheckCircle, AlertTriangle, User, GitPullRequest } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface ReviewData {
  averageReviewTimeHours: number;
  approvalRate: number;
  approved: number;
  changesRequested: number;
  bottlenecks: Array<{
    title: string;
    author: string;
    comments: number;
    daysOpen: number;
    url: string;
  }>;
  activity: Array<{
    name: string;
    avatar: string;
    reviews: number;
    comments: number;
  }>;
}

export default function CodeReviewAnalytics() {
  const { data: analytics, isLoading } = useQuery<ReviewData>({
    queryKey: ['reviewAnalytics'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/analytics/reviews`);
      return res.json();
    }
  });

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-300">
      <TopNav title="Code Reviews" subtitle="Review metrics and assigned pull requests" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-indigo-400" />
            Code Review Analytics
          </h1>
          <p className="mt-2 text-slate-400">Deep insights into team collaboration, bottlenecks, and review velocity.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#111113] border border-white/5 rounded-xl p-6 flex items-center justify-between shadow-2xl">
                <div>
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Avg Review Time</p>
                  <p className="mt-2 text-4xl font-light text-white">{analytics?.averageReviewTimeHours} <span className="text-xl text-slate-500">hrs</span></p>
                </div>
                <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-indigo-400" />
                </div>
              </div>

              <div className="bg-[#111113] border border-white/5 rounded-xl p-6 flex items-center justify-between shadow-2xl">
                <div>
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Approval Rate</p>
                  <p className="mt-2 text-4xl font-light text-white">{analytics?.approvalRate}<span className="text-xl text-slate-500">%</span></p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
              </div>

              <div className="bg-[#111113] border border-white/5 rounded-xl p-6 flex items-center justify-between shadow-2xl">
                <div>
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Changes Requested</p>
                  <p className="mt-2 text-4xl font-light text-white">{analytics?.changesRequested}</p>
                </div>
                <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-rose-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Review Bottlenecks */}
              <div className="bg-[#111113] border border-white/5 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <GitPullRequest className="w-5 h-5 text-amber-400" />
                  <h2 className="text-xl font-medium text-white">Review Bottlenecks</h2>
                </div>
                
                {analytics?.bottlenecks.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">No bottlenecks detected. Great job!</div>
                ) : (
                  <div className="space-y-4">
                    {analytics?.bottlenecks.map((b, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/40 rounded-lg border border-white/5 gap-4">
                        <div className="flex-1 min-w-0">
                          <a href={b.url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 font-medium truncate block">
                            {b.title}
                          </a>
                          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                            <User className="w-3 h-3" /> {b.author}
                          </div>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <div className="flex flex-col items-end">
                            <span className="text-white">{b.comments}</span>
                            <span className="text-slate-500">Comments</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-white">{b.daysOpen}</span>
                            <span className="text-slate-500">Days Open</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviewer Activity */}
              <div className="bg-[#111113] border border-white/5 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-xl font-medium text-white">Top Reviewers</h2>
                </div>

                <div className="space-y-4">
                  {analytics?.activity.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-white/5">
                      <div className="flex items-center gap-3">
                        <img src={a.avatar} alt={a.name} className="w-10 h-10 rounded-full border border-white/10" />
                        <span className="font-medium text-white">{a.name}</span>
                      </div>
                      <div className="flex gap-6 text-sm">
                        <div className="flex flex-col items-center">
                          <span className="text-emerald-400 font-medium">{a.reviews}</span>
                          <span className="text-slate-500">Reviews</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-indigo-400 font-medium">{a.comments}</span>
                          <span className="text-slate-500">Comments</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {analytics?.activity.length === 0 && (
                    <div className="text-center py-8 text-slate-500">No review activity found.</div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
