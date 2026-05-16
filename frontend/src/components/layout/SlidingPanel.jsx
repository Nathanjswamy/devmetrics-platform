import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function SlidingPanel({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(15,23,42,0.25)',
              backdropFilter: 'blur(4px)',
              zIndex: 40,
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.05, duration: 0.4 }}
            style={{
              position: 'fixed', right: 0, top: 0, bottom: 0,
              width: '100%', maxWidth: '560px',
              background: '#FFFFFF',
              borderLeft: '1px solid #E2E8F8',
              boxShadow: '-8px 0 40px rgba(15,23,42,0.12)',
              zIndex: 50,
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Panel Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #F1F5F9',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #F8FAFF, #FFFFFF)',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '16px', fontWeight: 700, color: '#0F172A',
                    letterSpacing: '-0.02em', margin: 0,
                  }}
                >
                  {title}
                </h2>
                <p style={{ fontSize: '11px', color: '#94A3B8', margin: '2px 0 0', fontWeight: 500 }}>
                  Detailed breakdown
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: '#F1F5F9', border: '1px solid #E2E8F8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#64748B',
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Panel Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
