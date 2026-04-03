'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { useChatStore } from '@/store/chatStore';
import { FiX, FiDownload, FiCopy, FiShare2, FiHeart, FiCheck } from 'react-icons/fi';

export default function PreviewPanel() {
  const { previewPanelOpen, setPreviewPanelOpen, creativeBrainData, selectedImageId, setSelectedImageId } = useUIStore();
  const { getActiveMessages } = useChatStore();
  const messages = getActiveMessages();
  const [copied, setCopied] = useState(false);
  const [savedImages, setSavedImages] = useState<Set<string>>(new Set());

  // Find which message contains the selected image
  const messageWithSelectedImage = messages.find(m => 
    m.output?.images?.some(img => img.id === selectedImageId)
  );

  // Get latest AI message with output as fallback
  const latestOutputMessage = [...messages]
    .reverse()
    .find((m) => m.role === 'assistant' && m.output && !m.isLoading);

  // If we clicked an image, show its parent output. Otherwise show latest.
  const activeMessage = messageWithSelectedImage || latestOutputMessage;
  const output = activeMessage?.output;

  // Determine which precise image should be displayed prominently
  const activeImage = output?.images?.find(img => img.id === selectedImageId) || output?.images?.[0];

  return (
    <AnimatePresence>
      {previewPanelOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '45%', opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-[var(--color-bg-secondary)] border-l border-[var(--color-border-glass)] flex flex-col overflow-hidden shrink-0"
          id="preview-panel"
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-[var(--color-border-glass)]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-accent-secondary)] animate-pulse" />
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                Preview
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-text-muted)] transition-colors">
                <FiShare2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewPanelOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-text-muted)] transition-colors"
                id="btn-close-preview"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {output ? (
              <div className="space-y-6">
                {/* Images Preview */}
                {output.images && output.images.length > 0 && activeImage && (
                  <div className="space-y-4">
                    {/* Main large image */}
                    <motion.div
                      key={activeImage.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-2xl overflow-hidden border border-[var(--color-border-glass)] aspect-square"
                    >
                      <img
                        src={activeImage.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    {/* Thumbnail strip */}
                    {output.images.length > 1 && (
                      <div className="flex gap-2">
                        {output.images.map((img, i) => (
                          <motion.div
                            key={img.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => setSelectedImageId(img.id)}
                            className={`w-16 h-16 rounded-lg overflow-hidden border cursor-pointer transition-colors ${
                              activeImage.id === img.id ? 'border-[var(--color-accent-primary)]' : 'border-[var(--color-border-glass)] hover:border-[var(--color-border-glass-bright)]'
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={`Variation ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = activeImage.url;
                          link.download = `vizzy-${activeImage.id}.png`;
                          link.target = '_blank';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="btn-primary flex items-center justify-center gap-2 text-xs flex-1"
                      >
                        <FiDownload className="w-4 h-4" /> Download
                      </button>
                      <button 
                        onClick={() => {
                          if (activeImage?.prompt) {
                            navigator.clipboard.writeText(activeImage.prompt);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }
                        }}
                        className="btn-secondary flex items-center justify-center gap-2 text-xs flex-1 transition-colors"
                      >
                        {copied ? <FiCheck className="w-4 h-4 text-green-400" /> : <FiCopy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy Prompt'}
                      </button>
                      <button 
                        onClick={() => {
                          if (!activeImage) return;
                          setSavedImages((prev) => {
                            const next = new Set(prev);
                            if (next.has(activeImage.id)) {
                              next.delete(activeImage.id);
                            } else {
                              next.add(activeImage.id);
                            }
                            return next;
                          });
                        }}
                        className={`flex items-center justify-center gap-2 text-xs flex-1 transition-colors ${
                          activeImage && savedImages.has(activeImage.id) 
                            ? 'btn-secondary !bg-red-500/20 !text-red-400 !border-red-500/30' 
                            : 'btn-secondary'
                        }`}
                      >
                        <FiHeart className={`w-4 h-4 ${activeImage && savedImages.has(activeImage.id) ? 'fill-red-400 text-red-400' : ''}`} /> 
                        {activeImage && savedImages.has(activeImage.id) ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Story Preview */}
                {output.stories && output.stories.length > 0 && (
                  <div className="space-y-4">
                    {output.stories.map((scene, i) => (
                      <motion.div
                        key={scene.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass rounded-xl p-4"
                      >
                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-accent-primary)] mb-1">
                          Scene {i + 1}
                        </p>
                        <h3 className="font-semibold text-sm mb-2">{scene.title}</h3>
                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                          {scene.content}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Video Scenes Preview */}
                {output.videoScenes && output.videoScenes.length > 0 && (
                  <div className="space-y-3">
                    {output.videoScenes.map((scene, i) => (
                      <motion.div
                        key={scene.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass rounded-xl p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent-secondary)] to-[var(--color-accent-primary)] flex items-center justify-center text-xs font-bold">
                            {scene.scene}
                          </div>
                          <span className="text-xs text-[var(--color-accent-secondary)]">
                            {scene.duration}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                          {scene.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Poster Preview */}
                {output.posterData && (
                  <div
                    className="rounded-2xl aspect-[3/4] flex flex-col justify-end p-6 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${output.posterData.brandColors[0]}, ${output.posterData.brandColors[1]})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="relative z-10">
                      <h2 className="text-xl font-bold text-white mb-1">{output.posterData.title}</h2>
                      <p className="text-sm text-white/70">{output.posterData.subtitle}</p>
                    </div>
                  </div>
                )}

                {/* Creative Brain Info */}
                {creativeBrainData && (
                  <div className="glass rounded-xl p-4 space-y-3">
                    <h3 className="text-xs font-semibold text-[var(--color-accent-primary)] flex items-center gap-1.5">
                      🧠 Creative Brain Analysis
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-[var(--color-text-muted)] mb-0.5">Intent</p>
                        <p className="text-[var(--color-text-secondary)] capitalize">
                          {creativeBrainData.detectedIntent.replace('_', ' ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--color-text-muted)] mb-0.5">Style</p>
                        <p className="text-[var(--color-text-secondary)] capitalize">
                          {creativeBrainData.styleApplied}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[var(--color-text-muted)] mb-0.5">Confidence</p>
                        <div className="w-full h-1.5 rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${creativeBrainData.confidence * 100}%` }}
                            className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)]"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                      {creativeBrainData.reasoning}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4">
                  <span className="text-2xl opacity-40">✦</span>
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Generated content will appear here
                </p>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
