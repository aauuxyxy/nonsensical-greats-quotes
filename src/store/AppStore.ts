import { create } from 'zustand';

interface AppState {
  isInitialized: boolean;
  loadProgress: number; // 0 - 100
  setInitialized: (val: boolean) => void;
  setLoadProgress: (progress: number) => void;
}

/**
 * アプリ全体の初期化状態や、LLMモデルのロード進捗を管理するストア。
 */
export const useAppStore = create<AppState>((set) => ({
  isInitialized: false,
  loadProgress: 0,
  
  setInitialized: (val: boolean) => set({ isInitialized: val }),
  setLoadProgress: (progress: number) => set({ loadProgress: progress }),
}));
