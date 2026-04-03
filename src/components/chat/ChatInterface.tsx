'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { useUIStore } from '@/store/uiStore';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import PromptSuggestions from '@/components/ui/PromptSuggestions';

export default function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getActiveMessages, isGenerating, activeConversationId } = useChatStore();
  const { previewPanelOpen } = useUIStore();
  const messages = getActiveMessages();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const isEmpty = messages.length === 0;

  return (
    <div
      className={`flex flex-col h-full transition-all duration-500 ease-out ${
        previewPanelOpen ? 'w-[55%]' : 'w-full'
      }`}
    >
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6" id="chat-messages">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-2xl mx-auto"
            >
              {/* Logo / Branding */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-8"
              >
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[var(--color-accent-primary)] via-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)] flex items-center justify-center mb-6 glow-md">
                  <span className="text-3xl">✦</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-[var(--font-display)] mb-3">
                  <span className="gradient-text">Vizzy Chat</span>
                </h1>
                <p className="text-[var(--color-text-secondary)] text-lg">
                  Your AI-powered creative companion
                </p>
              </motion.div>

              {/* Prompt Suggestions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <PromptSuggestions />
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-1">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </AnimatePresence>

            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <TypingIndicator />
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 px-4 md:px-8 pb-4 pt-2">
        <div className="max-w-4xl mx-auto">
          <ChatInput conversationId={activeConversationId} />
        </div>
      </div>
    </div>
  );
}
