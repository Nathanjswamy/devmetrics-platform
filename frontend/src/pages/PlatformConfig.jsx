import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

export default function PlatformConfig() {
  return (
    <div className="p-6 md:p-8 max-w-[1000px] mx-auto">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
        style={{ paddingBottom: '24px', borderBottom: '1px solid #E2E8F8' }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F1F5F9' }}>
            <Settings className="w-5 h-5" style={{ color: '#475569' }} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl" style={{ color: '#0F172A', letterSpacing: '-0.04em' }}>
              Platform Configuration
            </h1>
            <p className="text-sm" style={{ color: '#64748B' }}>
              Manage system thresholds, integrations, and user access.
            </p>
          </div>
        </div>
      </motion.header>

      <div className="card p-8">
        <h3 className="font-bold text-lg mb-4" style={{ color: '#0F172A' }}>Integrations Setup</h3>
        <p className="text-sm mb-6" style={{ color: '#64748B' }}>
          Connect your GitHub, GitLab, Jira, and Linear accounts to automatically sync data.
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ border: '1px solid #E2E8F8', background: '#F8FAFF' }}>
            <div className="font-bold text-sm" style={{ color: '#1E293B' }}>GitHub Enterprise</div>
            <button className="px-4 py-1.5 text-xs font-bold rounded bg-indigo-600 text-white">Connected</button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ border: '1px solid #E2E8F8' }}>
            <div className="font-bold text-sm" style={{ color: '#1E293B' }}>Jira Server</div>
            <button className="px-4 py-1.5 text-xs font-bold rounded bg-gray-100 text-gray-600 hover:bg-gray-200">Connect</button>
          </div>
        </div>
      </div>
    </div>
  );
}
