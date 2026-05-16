import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Code, Activity, Bug } from 'lucide-react';

export default function EngineeringTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/team');
        if (res.data.success) setTeam(res.data.data);
      } catch (err) {
        console.error('Failed to fetch team data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
        style={{ paddingBottom: '24px', borderBottom: '1px solid #E2E8F8' }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F5F3FF' }}>
            <Users className="w-5 h-5" style={{ color: '#7C3AED' }} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl" style={{ color: '#0F172A', letterSpacing: '-0.04em' }}>
              Engineering Team
            </h1>
            <p className="text-sm" style={{ color: '#64748B' }}>
              Developer performance and workload metrics.
            </p>
          </div>
        </div>
      </motion.header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-48 rounded-xl skeleton" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {team.map((dev, idx) => (
            <motion.div
              key={dev.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card p-5 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4 pb-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
                     style={{ background: `hsl(${(dev.name.charCodeAt(0) * 10) % 360}, 65%, 50%)` }}>
                  {dev.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base" style={{ color: '#0F172A' }}>{dev.name}</h3>
                  <p className="text-xs font-semibold" style={{ color: '#64748B' }}>{dev.role} · {dev.team} Team</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>Total PRs</p>
                  <p className="text-xl font-black" style={{ color: '#4F46E5' }}>{dev.total_prs}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>Avg Lead Time</p>
                  <p className="text-xl font-black" style={{ color: '#059669' }}>{dev.avg_lead_time ? `${Math.round(dev.avg_lead_time)}h` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>Open PRs</p>
                  <p className="text-xl font-black" style={{ color: dev.open_prs > 2 ? '#D97706' : '#1E293B' }}>{dev.open_prs}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
