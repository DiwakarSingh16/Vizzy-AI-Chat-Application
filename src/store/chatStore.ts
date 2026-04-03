import { create } from 'zustand';
import { Message, Conversation, AppMode } from '@/lib/types';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isGenerating: boolean;

  // Actions
  createConversation: (mode: AppMode) => string;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  deleteConversation: (id: string) => void;
  setIsGenerating: (val: boolean) => void;
  getActiveConversation: () => Conversation | undefined;
  getActiveMessages: () => Message[];
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  isGenerating: false,

  createConversation: (mode: AppMode) => {
    const id = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const conversation: Conversation = {
      id,
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      mode,
    };

    set((state) => ({
      conversations: [conversation, ...state.conversations],
      activeConversationId: id,
    }));

    return id;
  },

  setActiveConversation: (id: string) => {
    set({ activeConversationId: id });
  },

  addMessage: (conversationId: string, message: Message) => {
    set((state) => ({
      conversations: state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          const updatedMessages = [...conv.messages, message];
          // Update title from first user message
          let title = conv.title;
          if (message.role === 'user' && conv.messages.length === 0) {
            title = message.content.slice(0, 50) + (message.content.length > 50 ? '…' : '');
          }
          return {
            ...conv,
            messages: updatedMessages,
            title,
            updatedAt: new Date(),
          };
        }
        return conv;
      }),
    }));
  },

  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => {
    set((state) => ({
      conversations: state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: conv.messages.map((msg) =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
            updatedAt: new Date(),
          };
        }
        return conv;
      }),
    }));
  },

  deleteConversation: (id: string) => {
    set((state) => {
      const filtered = state.conversations.filter((c) => c.id !== id);
      return {
        conversations: filtered,
        activeConversationId:
          state.activeConversationId === id
            ? filtered[0]?.id || null
            : state.activeConversationId,
      };
    });
  },

  setIsGenerating: (val: boolean) => {
    set({ isGenerating: val });
  },

  getActiveConversation: () => {
    const state = get();
    return state.conversations.find((c) => c.id === state.activeConversationId);
  },

  getActiveMessages: () => {
    const state = get();
    const conv = state.conversations.find((c) => c.id === state.activeConversationId);
    return conv?.messages || [];
  },
}));
