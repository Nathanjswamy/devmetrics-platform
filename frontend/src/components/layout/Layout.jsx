import React from 'react';
import { Sidebar } from './Sidebar';

export function Layout({ children }) {
  return (
    <div className="flex w-full" style={{ background: '#F0F4FF', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <Sidebar />
      <main className="flex-1 min-h-screen min-w-0">
        {children}
      </main>
    </div>
  );
}
