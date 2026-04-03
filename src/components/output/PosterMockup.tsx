'use client';

import { motion } from 'framer-motion';

interface Props {
  data?: {
    title: string;
    subtitle: string;
    imageUrl: string;
    brandColors: string[];
  };
  text?: string;
}

export default function PosterMockup({ data, text }: Props) {
  if (!data) return null;

  return (
    <div className="space-y-3" id="poster-mockup">
      {/* Poster Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden aspect-[3/4] max-w-xs"
        style={{
          background: `linear-gradient(135deg, ${data.brandColors[0] || '#1a1a2e'}, ${data.brandColors[1] || '#8b5cf6'})`,
        }}
      >
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          {/* Decorative elements */}
          <div className="absolute top-6 right-6 w-16 h-16 rounded-full border border-[rgba(255,255,255,0.15)]" />
          <div className="absolute top-10 right-10 w-8 h-8 rounded-full border border-[rgba(255,255,255,0.1)]" />

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white mb-2 leading-tight font-[var(--font-display)]"
            >
              {data.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-[rgba(255,255,255,0.7)]"
            >
              {data.subtitle}
            </motion.p>
          </div>

          {/* Brand colors bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-2 mt-4"
          >
            {data.brandColors.map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border border-[rgba(255,255,255,0.2)]"
                style={{ backgroundColor: color }}
              />
            ))}
          </motion.div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </motion.div>

      {/* Marketing text */}
      {text && (
        <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
          {text}
        </div>
      )}
    </div>
  );
}
