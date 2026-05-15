import { create } from "zustand";
import { AppState, AppStateStatus } from "react-native";
import { Quote } from "../types/Quote";

const MAX_CACHE_SIZE = 100;

interface QuoteState {
  quotes: Quote[];
  addQuotes: (newQuotes: Quote[]) => void;
  popQuote: () => void; // 先頭の名言を取り除く
  clear: () => void;
}

/**
 * Zustandを用いた名言キャッシュストア。
 *
 * 【キャッシュ管理のベストプラクティス】
 * React Nativeにおける長時間の setTimeout はOSのタスク管理により不確実な挙動を招くため排除し、
 * AppState（フォアグラウンド/バックグラウンド）のライフサイクルイベントのみに依存して
 * 揮発性（バックグラウンド移行時の自動破棄）を確実かつ安全に担保します。
 */
export const useQuoteStore = create<QuoteState>((set) => ({
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
  },
  
  popQuote: () => {
    set((state) => ({
      quotes: state.quotes.slice(1),
    }));
  },

  clear: () => {
    set({ quotes: [] });
  },
}));

// アプリのバックグラウンド移行時の状態監視
// OSレベルでのバックグラウンド移行時に確実かつ安全にキャッシュを破棄する
AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
  if (nextAppState === "background") {
    useQuoteStore.getState().clear();
  }
});
