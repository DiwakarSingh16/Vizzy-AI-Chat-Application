'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { useUIStore } from '@/store/uiStore';
import ModeToggle from '@/components/ui/ModeToggle';
import {
  FiPlus,
  FiMessageSquare,
  FiTrash2,
  FiChevronLeft,
  FiZap,
} from 'react-icons/fi';

export default function Sidebar() {
  const { conversations, activeConversationId, setActiveConversation, createConversation, deleteConversation } =
    useChatStore();
  const { sidebarOpen, toggleSidebar, mode } = useUIStore();

  const handleNewChat = () => {
    createConversation(mode);
  };

  return (
    <>
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-[var(--color-bg-secondary)] border-r border-[var(--color-border-glass)] flex flex-col overflow-hidden shrink-0"
            id="sidebar"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-[var(--color-border-glass)]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center text-xs">
                  ✦
                </div>
                <span className="font-semibold text-sm gradient-text">Vizzy</span>
              </div>
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[var(--color-text-muted)]"
                id="btn-collapse-sidebar"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* New Chat Button */}
            <div className="p-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNewChat}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl glass-bright hover:border-[var(--color-border-glass-bright)] transition-all duration-200 text-sm font-medium"
                id="btn-new-chat"
              >
                <FiPlus className="w-4 h-4 text-[var(--color-accent-primary)]" />
                <span>New Creation</span>
              </motion.button>
            </div>

            {/* Mode Toggle */}
            <div className="px-3 pb-3">
              <ModeToggle />
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider px-2 mb-2 font-medium">
                History
              </p>
              <div className="space-y-1">
                <AnimatePresence>
                  {conversations.map((conv) => (
                    <motion.div
                      key={conv.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                        activeConversationId === conv.id
                          ? 'bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.2)]'
                          : 'hover:bg-[rgba(255,255,255,0.03)] border border-transparent'
                      }`}
                      onClick={() => setActiveConversation(conv.id)}
                    >
                      <FiMessageSquare className="w-4 h-4 shrink-0 text-[var(--color-text-muted)]" />
                      <span className="text-sm truncate flex-1 text-[var(--color-text-secondary)]">
                        {conv.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-[rgba(255,255,255,0.1)] transition-all text-[var(--color-text-muted)] hover:text-red-400"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {conversations.length === 0 && (
                  <div className="text-center py-8">
                    <FiZap className="w-8 h-8 mx-auto text-[var(--color-text-muted)] opacity-30 mb-2" />
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Start a new creation
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-[var(--color-border-glass)]">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-tertiary)] opacity-60" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--color-text-secondary)] truncate">
                    Creative Mode
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">
                    {mode === 'home' ? '🏠 Personal' : '🏢 Business'}
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Collapsed toggle */}
      {!sidebarOpen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-xl glass hover:glass-bright transition-all duration-200"
          id="btn-expand-sidebar"
        >
          <FiMessageSquare className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </motion.button>
      )}
    </>
  );
}
