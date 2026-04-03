'use client';

import { motion } from 'framer-motion';
import { StoryScene } from '@/lib/types';

interface Props {
  scenes: StoryScene[];
}

export default function StoryCards({ scenes }: Props) {
  if (scenes.length === 0) return null;

  const sceneGradients = [
    'from-[#1e1b4b] to-[#312e81]',
    'from-[#0c4a6e] to-[#164e63]',
    'from-[#4c1d95] to-[#5b21b6]',
    'from-[#831843] to-[#9d174d]',
  ];

  const sceneIcons = ['✨', '🔮', '⚡', '🌟'];

  return (
    <div className="space-y-3" id="story-cards">
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
        {scenes.map((scene, i) => (
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className={`flex-shrink-0 w-64 rounded-2xl bg-gradient-to-br ${
              sceneGradients[i % sceneGradients.length]
            } border border-[rgba(255,255,255,0.08)] p-5 snap-start`}
          >
            {/* Scene header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{sceneIcons[i % sceneIcons.length]}</span>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[rgba(255,255,255,0.4)] font-medium">
                  Scene {i + 1}
                </p>
                <h3 className="text-sm font-semibold text-white">
                  {scene.title}
                </h3>
              </div>
            </div>

            {/* Content */}
            <p className="text-xs leading-relaxed text-[rgba(255,255,255,0.7)] mb-4">
              {scene.content}
            </p>

            {/* Visual Prompt */}
            <div className="mt-auto pt-3 border-t border-[rgba(255,255,255,0.08)]">
              <p className="text-[10px] uppercase tracking-wider text-[rgba(255,255,255,0.3)] mb-1">
                Visual Prompt
              </p>
              <p className="text-[11px] text-[rgba(255,255,255,0.5)] italic leading-relaxed">
                {scene.visualPrompt}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation hint */}
      <p className="text-[11px] text-[var(--color-text-muted)] text-center">
        ← Scroll to explore scenes →
      </p>
    </div>
  );
}
