import React from 'react';
import { ActionableResolutionCenter } from '../components/ActionableResolutionCenter';

export default function ResolutionCenter() {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Resolution Center</h1>
        <p className="text-slate-400 text-lg">Directly resolve critical issues across your repositories.</p>
      </div>
      <div className="flex-1 min-h-0">
        <ActionableResolutionCenter />
      </div>
    </div>
  );
}
