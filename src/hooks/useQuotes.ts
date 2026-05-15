import { useSyncExternalStore } from "react";
import { quoteStore } from "../store/QuoteStore";

/**
 * QuoteStoreの現在のキャッシュ状態（名言の配列）をリアクティブに取得するカスタムフック。
 * キャッシュが更新（追加やクリア）されると、このフックを利用しているコンポーネントが再レンダリングされます。
 */
export const useQuotes = () => {
  return useSyncExternalStore(quoteStore.subscribe, quoteStore.getSnapshot);
};
