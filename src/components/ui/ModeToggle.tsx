'use client';

import { motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { FiHome, FiBriefcase } from 'react-icons/fi';

export default function ModeToggle() {
  const { mode, setMode } = useUIStore();

  return (
    <div className="glass rounded-xl p-1 flex relative" id="mode-toggle">
      {/* Sliding background */}
      <motion.div
        className="absolute inset-y-1 rounded-lg bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] opacity-20"
        animate={{
          left: mode === 'home' ? '4px' : '50%',
          width: 'calc(50% - 4px)',
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />

      <button
        onClick={() => setMode('home')}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-200 relative z-10 ${
          mode === 'home'
            ? 'text-[var(--color-text-primary)]'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
        }`}
        id="btn-home-mode"
      >
        <FiHome className="w-3.5 h-3.5" />
        Home
      </button>

      <button
        onClick={() => setMode('business')}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-200 relative z-10 ${
          mode === 'business'
            ? 'text-[var(--color-text-primary)]'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
        }`}
        id="btn-business-mode"
      >
        <FiBriefcase className="w-3.5 h-3.5" />
        Business
      </button>
    </div>
  );
}
