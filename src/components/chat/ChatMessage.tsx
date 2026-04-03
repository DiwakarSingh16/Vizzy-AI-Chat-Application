'use client';

import { motion } from 'framer-motion';
import { Message } from '@/lib/types';
import OutputRenderer from '@/components/output/OutputRenderer';
import RefineButtons from '@/components/ui/RefineButtons';
import CreativeBrainBadge from '@/components/ui/CreativeBrainBadge';
import { FiUser } from 'react-icons/fi';

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';
  const isLoading = message.isLoading;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-3 py-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      id={`message-${message.id}`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="shrink-0 mt-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center text-sm shadow-lg">
            ✦
          </div>
        </div>
      )}

      {/* Message Content */}
      <div
        className={`max-w-[85%] md:max-w-[75%] ${
          isUser ? 'order-first' : ''
        }`}
      >
        {/* Creative Brain Badge */}
        {!isUser && message.reasoning && (
          <CreativeBrainBadge reasoning={message.reasoning} />
        )}

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-[var(--color-user-bubble)] border border-[rgba(139,92,246,0.2)] ml-auto'
              : 'bg-[var(--color-ai-bubble)] border border-[var(--color-border-glass)]'
          }`}
        >
          {isLoading ? (
            <div className="space-y-3">
              <div className="skeleton h-4 w-48 rounded" />
              <div className="skeleton h-4 w-64 rounded" />
              <div className="skeleton h-4 w-36 rounded" />
            </div>
          ) : (
            <>
              {/* Text Content */}
              {message.content && (
                <div className="text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-[var(--color-text-primary)]">
                  {message.content}
                </div>
              )}

              {/* Output Content */}
              {message.output && (
                <div className="mt-3">
                  <OutputRenderer output={message.output} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Refine Buttons for AI responses */}
        {!isUser && !isLoading && message.output && (
          <div className="mt-2">
            <RefineButtons messageId={message.id} />
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="shrink-0 mt-1 order-last">
          <div className="w-8 h-8 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-glass)] flex items-center justify-center text-sm">
            <FiUser className="w-4 h-4 text-[var(--color-text-secondary)]" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
