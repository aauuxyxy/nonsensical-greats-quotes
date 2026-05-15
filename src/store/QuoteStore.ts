import { create } from "zustand";
import { AppState, AppStateStatus } from "react-native";
import { Quote } from "../types/Quote";

const MAX_CACHE_SIZE = 100;
const EXPIRATION_TIME_MS = 60 * 60 * 1000; // 1時間

interface QuoteState {
  quotes: Quote[];
  addQuotes: (newQuotes: Quote[]) => void;
  clear: () => void;
}

// 揮発性タイマーの参照をモジュールスコープで管理
let expirationTimer: ReturnType<typeof setTimeout> | null = null;

const resetExpirationTimer = (clearAction: () => void) => {
  if (expirationTimer) clearTimeout(expirationTimer);
  expirationTimer = setTimeout(clearAction, EXPIRATION_TIME_MS);
};

/**
 * Zustandを用いた名言キャッシュストア。
 * UIレンダリングの最適化と、シンプルな状態管理を実現します。
 */
export const useQuoteStore = create<QuoteState>((set, get) => ({
  quotes: [],

  addQuotes: (newQuotes: Quote[]) => {
    set((state) => {
      const combined = [...state.quotes, ...newQuotes];
      // 100件を超える場合は古いもの（先頭）から順に破棄
      return {
        quotes:
          combined.length > MAX_CACHE_SIZE
            ? combined.slice(combined.length - MAX_CACHE_SIZE)
            : combined,
      };
    });
    // 追加アクションのたびに揮発タイマーをリセット
    resetExpirationTimer(get().clear);
  },

  clear: () => {
    set({ quotes: [] });
  },
}));

// アプリのバックグラウンド移行時の状態監視
AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
  if (nextAppState === "background") {
    useQuoteStore.getState().clear();
  } else if (nextAppState === "active") {
    resetExpirationTimer(useQuoteStore.getState().clear);
  }
});

// モジュール読み込み時に初回タイマーを開始
resetExpirationTimer(useQuoteStore.getState().clear);
