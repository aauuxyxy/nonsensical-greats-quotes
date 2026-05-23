import { create } from 'zustand';

interface AppState {
  isInitialized: boolean;
  loadProgress: number; // 0 - 100
  modelUrl: string | null;
  setInitialized: (val: boolean) => void;
  setLoadProgress: (progress: number) => void;
  setModelUrl: (url: string) => void;
}

/**
 * アプリ全体の初期化状態や、LLMモデルのロード進捗を管理するストア。
 */
export const useAppStore = create<AppState>((set) => ({
  isInitialized: false,
  loadProgress: 0,
  modelUrl: null,
  
  setInitialized: (val: boolean) => set({ isInitialized: val }),
  setLoadProgress: (progress: number) => set({ loadProgress: progress }),
  setModelUrl: (url: string) => set({ modelUrl: url }),
}));
