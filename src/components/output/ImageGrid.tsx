'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageOutput } from '@/lib/types';
import { useUIStore } from '@/store/uiStore';
import { FiDownload, FiHeart, FiMaximize2, FiShare2, FiCopy } from 'react-icons/fi';

interface Props {
  images: ImageOutput[];
}

export default function ImageGrid({ images }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());
  const { setSelectedImageId } = useUIStore();

  const toggleLike = (id: string) => {
    setLikedImages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelect = (img: ImageOutput, idx: number) => {
    setSelectedIdx(idx);
    setSelectedImageId(img.id);
  };

  const handleDownload = async (url: string, name: string) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = `vizzy-${name}.png`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      window.open(url, '_blank');
    }
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
  };

  if (images.length === 0) return null;

  return (
    <div className="space-y-3" id="image-grid">
      {/* Grid */}
      <div className={`grid gap-2 ${images.length <= 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`relative group aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
              selectedIdx === i
                ? 'border-[var(--color-accent-primary)] glow-sm'
                : 'border-transparent hover:border-[var(--color-border-glass-bright)]'
            }`}
            onClick={() => handleSelect(img, i)}
          >
            <img
              src={img.url}
              alt={img.prompt || `Generated image ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDownload(img.url, img.id); }}
                  className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  title="Download"
                >
                  <FiDownload className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLike(img.id); }}
                  className={`p-1.5 rounded-lg backdrop-blur-sm transition-colors ${
                    likedImages.has(img.id)
                      ? 'bg-red-500/40 text-red-300'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                  title="Favorite"
                >
                  <FiHeart className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleCopyPrompt(img.prompt); }}
                  className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  title="Copy prompt"
                >
                  <FiCopy className="w-3.5 h-3.5" />
                </button>
                <button
                  className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  title="Share"
                >
                  <FiShare2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Selection indicator */}
            {selectedIdx === i && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--color-accent-primary)] flex items-center justify-center text-xs shadow-lg"
              >
                ✓
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Selection info */}
      {selectedIdx !== null && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]"
        >
          <span>Image {selectedIdx + 1} selected</span>
          <span>•</span>
          <button
            className="text-[var(--color-accent-primary)] hover:underline"
            onClick={() => handleDownload(images[selectedIdx].url, images[selectedIdx].id)}
          >
            Download
          </button>
          <span>•</span>
          <button
            className="text-[var(--color-accent-secondary)] hover:underline"
            onClick={() => handleCopyPrompt(images[selectedIdx].prompt)}
          >
            Copy Prompt
          </button>
        </motion.div>
      )}
    </div>
  );
}
