'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { IntentType } from '@/lib/types';
import { FiCpu } from 'react-icons/fi';
import { useState } from 'react';

interface Props {
  reasoning: {
    detectedIntent: IntentType;
    styleApplied: string;
    reasoning: string;
  };
}

const intentLabels: Record<IntentType, { label: string; emoji: string }> = {
  image_generation: { label: 'Image Generation', emoji: '🎨' },
  image_editing: { label: 'Image Editing', emoji: '🖼️' },
  storytelling: { label: 'Storytelling', emoji: '📖' },
  marketing_content: { label: 'Marketing', emoji: '📊' },
  moodboard_creation: { label: 'Moodboard', emoji: '🎭' },
  video_prompt: { label: 'Video Prompt', emoji: '🎬' },
  general: { label: 'General', emoji: '💬' },
};

export default function CreativeBrainBadge({ reasoning }: Props) {
  const [expanded, setExpanded] = useState(false);
  const intentInfo = intentLabels[reasoning.detectedIntent] || intentLabels.general;

  return (
    <div className="mb-2">
      <motion.button
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setExpanded(!expanded)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.12)] text-[11px] text-[var(--color-accent-primary)] hover:bg-[rgba(139,92,246,0.12)] transition-all cursor-pointer"
      >
        <FiCpu className="w-3 h-3" />
        <span className="font-medium">Creative Brain</span>
        <span className="text-[var(--color-text-muted)]">•</span>
        <span>{intentInfo.emoji} {intentInfo.label}</span>
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 rounded-xl glass p-3 text-xs space-y-2 overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[var(--color-text-muted)] mb-0.5">Intent</p>
                <p className="font-medium text-[var(--color-text-secondary)]">
                  {intentInfo.emoji} {intentInfo.label}
                </p>
              </div>
              <div>
                <p className="text-[var(--color-text-muted)] mb-0.5">Style</p>
                <p className="font-medium text-[var(--color-text-secondary)] capitalize">
                  {reasoning.styleApplied}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)] mb-0.5">Reasoning</p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {reasoning.reasoning}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
