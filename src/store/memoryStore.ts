import { create } from 'zustand';
import { ImageStyle, UserPreferences } from '@/lib/types';

interface MemoryState extends UserPreferences {
  // Actions
  addPreferredStyle: (style: ImageStyle) => void;
  setPreferredTone: (tone: string) => void;
  addPreferredColor: (color: string) => void;
  addRecentPrompt: (prompt: string) => void;
  addFavoriteOutput: (outputId: string) => void;
  removeFavoriteOutput: (outputId: string) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
  getPersonalizationContext: () => string;
}

const STORAGE_KEY = 'vizzy-chat-memory';

const defaultPreferences: UserPreferences = {
  preferredStyles: [],
  preferredTone: 'creative',
  preferredColors: [],
  recentPrompts: [],
  favoriteOutputs: [],
};

export const useMemoryStore = create<MemoryState>((set, get) => ({
  ...defaultPreferences,

  addPreferredStyle: (style: ImageStyle) => {
    set((state) => {
      const styles = [style, ...state.preferredStyles.filter((s) => s !== style)].slice(0, 5);
      return { preferredStyles: styles };
    });
    get().saveToStorage();
  },

  setPreferredTone: (tone: string) => {
    set({ preferredTone: tone });
    get().saveToStorage();
  },

  addPreferredColor: (color: string) => {
    set((state) => {
      const colors = [color, ...state.preferredColors.filter((c) => c !== color)].slice(0, 10);
      return { preferredColors: colors };
    });
    get().saveToStorage();
  },

  addRecentPrompt: (prompt: string) => {
    set((state) => {
      const prompts = [prompt, ...state.recentPrompts.filter((p) => p !== prompt)].slice(0, 20);
      return { recentPrompts: prompts };
    });
    get().saveToStorage();
  },

  addFavoriteOutput: (outputId: string) => {
    set((state) => ({
      favoriteOutputs: [...new Set([...state.favoriteOutputs, outputId])],
    }));
    get().saveToStorage();
  },

  removeFavoriteOutput: (outputId: string) => {
    set((state) => ({
      favoriteOutputs: state.favoriteOutputs.filter((id) => id !== outputId),
    }));
    get().saveToStorage();
  },

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ ...defaultPreferences, ...parsed });
      }
    } catch {
      console.warn('Failed to load memory from storage');
    }
  },

  saveToStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      const state = get();
      const data: UserPreferences = {
        preferredStyles: state.preferredStyles,
        preferredTone: state.preferredTone,
        preferredColors: state.preferredColors,
        recentPrompts: state.recentPrompts,
        favoriteOutputs: state.favoriteOutputs,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      console.warn('Failed to save memory to storage');
    }
  },

  getPersonalizationContext: () => {
    const state = get();
    const parts: string[] = [];
    if (state.preferredStyles.length > 0) {
      parts.push(`User prefers these styles: ${state.preferredStyles.join(', ')}`);
    }
    if (state.preferredTone) {
      parts.push(`Preferred tone: ${state.preferredTone}`);
    }
    if (state.preferredColors.length > 0) {
      parts.push(`Preferred colors: ${state.preferredColors.join(', ')}`);
    }
    return parts.join('. ');
  },
}));
