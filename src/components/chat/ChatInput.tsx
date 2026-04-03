'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { useUIStore } from '@/store/uiStore';
import { useMemoryStore } from '@/store/memoryStore';
import { classifyIntent } from '@/lib/intent';
import { processCreativeRequest } from '@/lib/ai';
import { Message } from '@/lib/types';
import { getRandomLoadingMessage } from '@/lib/prompts';
import { FiSend, FiImage, FiMic, FiPaperclip } from 'react-icons/fi';

interface Props {
  conversationId: string | null;
}

export default function ChatInput({ conversationId }: Props) {
  const [input, setInput] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { addMessage, updateMessage, setIsGenerating, isGenerating, createConversation } =
    useChatStore();
  const { mode, setCreativeBrainData, setPreviewPanelOpen } = useUIStore();
  const { addRecentPrompt, getPersonalizationContext } = useMemoryStore();

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isGenerating) return;

    // Create conversation if needed
    let convId = conversationId;
    if (!convId) {
      convId = createConversation(mode);
    }

    // Classify intent
    const intentResult = classifyIntent(trimmed, mode);

    // Set creative brain data
    setCreativeBrainData({
      detectedIntent: intentResult.intent,
      styleApplied: intentResult.suggestedStyle,
      reasoning: intentResult.reasoning,
      confidence: intentResult.confidence,
    });

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
      intent: intentResult.intent,
    };
    addMessage(convId, userMessage);
    addRecentPrompt(trimmed);
    setInput('');
    setUploadedImage(null);

    // Add loading AI message
    const aiMessageId = `msg-${Date.now()}-ai`;
    const loadingMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: getRandomLoadingMessage(),
      timestamp: new Date(),
      isLoading: true,
    };
    addMessage(convId, loadingMessage);
    setIsGenerating(true);

    try {
      // Process the creative request
      const context = getPersonalizationContext();
      const output = await processCreativeRequest(
        trimmed,
        intentResult.intent,
        intentResult.suggestedStyle,
        mode
      );

      // Update AI message with result
      updateMessage(convId, aiMessageId, {
        content: output.text || '',
        output,
        isLoading: false,
        reasoning: {
          detectedIntent: intentResult.intent,
          styleApplied: intentResult.suggestedStyle,
          reasoning: intentResult.reasoning,
        },
      });

      // Open preview panel for visual outputs
      if (output.type !== 'text') {
        setPreviewPanelOpen(true);
      }
    } catch (error) {
      updateMessage(convId, aiMessageId, {
        content: 'Something went wrong. Please try again.',
        isLoading: false,
      });
    } finally {
      setIsGenerating(false);
    }
  }, [
    input,
    isGenerating,
    conversationId,
    mode,
    addMessage,
    updateMessage,
    setIsGenerating,
    createConversation,
    setCreativeBrainData,
    addRecentPrompt,
    getPersonalizationContext,
    setPreviewPanelOpen,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const [isListening, setIsListening] = useState(false);

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }
  };

  const handleMicClick = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setInput(transcript);
      autoResize();
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative"
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 rounded-2xl border-2 border-dashed border-[var(--color-accent-primary)] bg-[rgba(139,92,246,0.1)] flex items-center justify-center"
          >
            <p className="text-[var(--color-accent-primary)] font-medium">
              Drop image here
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded image preview */}
      <AnimatePresence>
        {uploadedImage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2"
          >
            <div className="relative inline-block">
              <img
                src={uploadedImage}
                alt="Upload preview"
                className="h-20 w-20 object-cover rounded-xl border border-[var(--color-border-glass)]"
              />
              <button
                onClick={() => setUploadedImage(null)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-400 transition-colors"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Container */}
      <div className="glass-bright rounded-2xl overflow-hidden glow-sm transition-all duration-300 focus-within:glow-md">
        <div className="flex items-end gap-2 p-3">
          {/* Action Buttons */}
          <div className="flex gap-1 pb-0.5">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200"
              title="Upload image"
              id="btn-upload-image"
            >
              <FiImage className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="input-file-upload"
            />
            <button
              onClick={handleMicClick}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isListening 
                  ? 'text-red-400 bg-red-400/10' 
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
              title="Voice input"
              id="btn-voice-input"
            >
              <FiMic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
            </button>
          </div>

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Describe your creative vision…"
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none text-[var(--color-text-primary)] text-[0.9375rem] placeholder:text-[var(--color-text-muted)] py-2 leading-relaxed"
            disabled={isGenerating}
            id="input-chat-message"
          />

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!input.trim() || isGenerating}
            className={`p-2.5 rounded-xl transition-all duration-300 bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] text-white ${
              input.trim() && !isGenerating
                ? 'shadow-lg shadow-[rgba(139,92,246,0.4)] opacity-100'
                : 'opacity-40 cursor-not-allowed'
            }`}
            id="btn-send-message"
          >
            <FiSend className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-[var(--color-text-muted)] mt-2 opacity-60">
        Vizzy may generate unexpected results. Review outputs carefully.
      </p>
    </motion.div>
  );
}
