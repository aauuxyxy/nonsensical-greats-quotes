import { useQuoteStore } from "../store/QuoteStore";

/**
 * UIコンポーネントがキャッシュデータ（名言リスト）のみを購読するためのカスタムフック。
 * Zustandのセレクタ機能を活用し、不要な再レンダリングを防ぎます。
 */
export const useQuotes = () => {
  return useQuoteStore((state) => state.quotes);
};
