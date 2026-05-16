import React from 'react';

function Bone({ className = '' }) {
  return (
    <div
      className={className}
      style={{
        borderRadius: '10px',
        background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <Bone className="w-24 h-3 mb-3" />
          <Bone className="w-72 h-9 mb-3" />
          <Bone className="w-96 h-5" />
        </div>
        <Bone className="w-44 h-16 rounded-2xl" />
      </div>
      {/* Alert row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[1, 2, 3].map(i => <Bone key={i} className="h-28 rounded-2xl" />)}
      </div>
      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
        {[1, 2, 3, 4, 5].map(i => <Bone key={i} className="h-56 rounded-2xl" />)}
      </div>
      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Bone className="lg:col-span-2 h-72 rounded-2xl" />
        <Bone className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}
