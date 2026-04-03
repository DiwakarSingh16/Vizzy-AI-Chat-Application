'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getRandomLoadingMessage } from '@/lib/prompts';

export default function TypingIndicator() {
  const [message, setMessage] = useState(getRandomLoadingMessage());

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(getRandomLoadingMessage());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-3 py-4">
      {/* Avatar */}
      <div className="shrink-0 mt-1">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center text-sm shadow-lg">
          <motion.span
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            ✦
          </motion.span>
        </div>
      </div>

      {/* Typing Bubble */}
      <div className="bg-[var(--color-ai-bubble)] border border-[var(--color-border-glass)] rounded-2xl px-4 py-3 max-w-sm">
        {/* Loading message */}
        <motion.p
          key={message}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-[var(--color-accent-secondary)] mb-2 font-medium"
        >
          {message}
        </motion.p>

        {/* Dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)]"
              animate={{
                scale: [0.6, 1, 0.6],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
