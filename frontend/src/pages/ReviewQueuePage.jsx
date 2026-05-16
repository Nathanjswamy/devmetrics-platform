import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { GitPullRequest, Clock, AlertCircle } from 'lucide-react';

function urgencyStyle(daysOpen) {
  if (daysOpen >= 5) return { bg: '#FEE2E2', text: '#991B1B', label: 'Stale', border: '#FCA5A5' };
  if (daysOpen >= 2) return { bg: '#FEF3C7', text: '#92400E', label: 'Aging', border: '#FCD34D' };
  return { bg: '#D1FAE5', text: '#065F46', label: 'Fresh', border: '#6EE7B7' };
}

export default function ReviewQueuePage() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/review-queue');
        if (res.data.success) setQueue(res.data.data);
      } catch (err) {
        console.error('Failed to fetch review queue', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
        style={{ paddingBottom: '24px', borderBottom: '1px solid #E2E8F8' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
              <GitPullRequest className="w-5 h-5" style={{ color: '#4F46E5' }} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-extrabold text-2xl" style={{ color: '#0F172A', letterSpacing: '-0.04em' }}>
                Full Review Queue
              </h1>
              <p className="text-sm" style={{ color: '#64748B' }}>
                All pull requests currently awaiting code review.
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>Total Open</p>
            <p className="text-2xl font-black" style={{ color: '#0F172A' }}>{queue.length}</p>
          </div>
        </div>
      </motion.header>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-20 rounded-xl skeleton" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {queue.length === 0 ? (
             <div className="card p-10 text-center">
               <p className="text-lg font-bold" style={{ color: '#64748B' }}>Queue is empty!</p>
               <p className="text-sm" style={{ color: '#94A3B8' }}>All pull requests have been reviewed.</p>
             </div>
          ) : (
            queue.map((pr, idx) => {
              const urg = urgencyStyle(pr.days_open);
              return (
                <motion.div
                  key={pr.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card p-4 flex items-center gap-4 transition-all hover:-translate-y-0.5"
                  style={{ borderLeft: `4px solid ${urg.border}` }}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base truncate" style={{ color: '#0F172A' }}>{pr.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm font-medium" style={{ color: '#64748B' }}>
                        By <span style={{ color: '#4F46E5' }}>{pr.developer_name}</span>
                      </p>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        {pr.size} lines
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Clock className="w-4 h-4" style={{ color: urg.text }} />
                    <span className="text-sm font-bold" style={{ background: urg.bg, color: urg.text, padding: '4px 10px', borderRadius: '999px' }}>
                      {pr.days_open} days open
                    </span>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      )}
    </div>
  );
}
