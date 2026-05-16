import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ActivityFeed } from '../components/ActivityFeed';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function LiveActivity() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/activity');
        if (res.data.success) {
          setFeed(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch full activity feed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-[1000px] mx-auto">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
        style={{ paddingBottom: '24px', borderBottom: '1px solid #E2E8F8' }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
            <Activity className="w-5 h-5" style={{ color: '#4F46E5' }} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl" style={{ color: '#0F172A', letterSpacing: '-0.04em' }}>
              Live Activity Stream
            </h1>
            <p className="text-sm" style={{ color: '#64748B' }}>
              Real-time feed of all team operations.
            </p>
          </div>
        </div>
      </motion.header>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 rounded-xl skeleton" />)}
        </div>
      ) : (
        <ActivityFeed feed={feed} />
      )}
    </div>
  );
}
