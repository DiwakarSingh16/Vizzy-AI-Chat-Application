'use client';

import { motion } from 'framer-motion';
import { VideoScene } from '@/lib/types';
import { FiFilm, FiCamera, FiClock, FiSmile } from 'react-icons/fi';

interface Props {
  scenes: VideoScene[];
}

export default function VideoStoryboard({ scenes }: Props) {
  if (scenes.length === 0) return null;

  return (
    <div className="space-y-3" id="video-storyboard">
      <div className="flex items-center gap-2 mb-2">
        <FiFilm className="w-4 h-4 text-[var(--color-accent-secondary)]" />
        <span className="text-xs font-medium text-[var(--color-text-secondary)]">
          Video Storyboard — {scenes.length} Scenes
        </span>
      </div>

      <div className="space-y-2">
        {scenes.map((scene, i) => (
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            className="glass rounded-xl p-4 hover:glass-bright transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              {/* Scene Number */}
              <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent-secondary)] to-[var(--color-accent-primary)] flex items-center justify-center font-bold text-sm">
                {scene.scene}
              </div>

              <div className="flex-1 min-w-0">
                {/* Description */}
                <p className="text-sm text-[var(--color-text-primary)] leading-relaxed mb-3">
                  {scene.description}
                </p>

                {/* Meta Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-[rgba(6,182,212,0.1)] text-[var(--color-accent-secondary)] border border-[rgba(6,182,212,0.15)]">
                    <FiCamera className="w-3 h-3" /> {scene.cameraAngle}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-[rgba(139,92,246,0.1)] text-[var(--color-accent-primary)] border border-[rgba(139,92,246,0.15)]">
                    <FiClock className="w-3 h-3" /> {scene.duration}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-[rgba(244,114,182,0.1)] text-[var(--color-accent-tertiary)] border border-[rgba(244,114,182,0.15)]">
                    <FiSmile className="w-3 h-3" /> {scene.mood}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline connector */}
            {i < scenes.length - 1 && (
              <div className="ml-5 mt-2 h-4 w-px bg-gradient-to-b from-[var(--color-border-glass-bright)] to-transparent" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Export hint */}
      <div className="text-center">
        <p className="text-[11px] text-[var(--color-text-muted)]">
          💡 Use these scenes with Runway, Pika, or Sora for video generation
        </p>
      </div>
    </div>
  );
}
