import { create } from 'zustand';
import { AppMode, CreativeBrainData } from '@/lib/types';

interface UIState {
  mode: AppMode;
  sidebarOpen: boolean;
  previewPanelOpen: boolean;
  creativeBrainOpen: boolean;
  creativeBrainData: CreativeBrainData | null;
  selectedImageId: string | null;

  // Actions
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setPreviewPanelOpen: (open: boolean) => void;
  togglePreviewPanel: () => void;
  setCreativeBrainOpen: (open: boolean) => void;
  setCreativeBrainData: (data: CreativeBrainData | null) => void;
  setSelectedImageId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mode: 'home',
  sidebarOpen: true,
  previewPanelOpen: false,
  creativeBrainOpen: false,
  creativeBrainData: null,
  selectedImageId: null,

  setMode: (mode: AppMode) => set({ mode }),
  toggleMode: () =>
    set((state) => ({ mode: state.mode === 'home' ? 'business' : 'home' })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setPreviewPanelOpen: (open: boolean) => set({ previewPanelOpen: open }),
  togglePreviewPanel: () =>
    set((state) => ({ previewPanelOpen: !state.previewPanelOpen })),
  setCreativeBrainOpen: (open: boolean) => set({ creativeBrainOpen: open }),
  setCreativeBrainData: (data: CreativeBrainData | null) =>
    set({ creativeBrainData: data }),
  setSelectedImageId: (id: string | null) => set({ selectedImageId: id }),
}));
