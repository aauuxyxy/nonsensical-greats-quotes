import {
  AppState,
  AppStateStatus,
  NativeEventSubscription,
} from "react-native";
import { Quote } from "../types/Quote";

const MAX_CACHE_SIZE = 100;
const EXPIRATION_TIME_MS = 60 * 60 * 1000; // 1時間

type Listener = () => void;

/**
 * 名言データのインメモリキャッシュを管理するストア。
 * 揮発性を持たせ、古いデータの破棄やバックグラウンド時のクリアを自動で行います。
 */
class QuoteStore {
  private quotes: Quote[] = [];
  private listeners: Set<Listener> = new Set();
  private expirationTimer: ReturnType<typeof setTimeout> | null = null;
  private appStateSubscription: NativeEventSubscription | null = null;

  constructor() {
    this.setupAppStateListener();
    this.resetExpirationTimer();
  }

  // --- React integration (useSyncExternalStore用) ---

  public subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  public getSnapshot = () => {
    return this.quotes;
  };

  // --- State mutations ---

  /**
   * 新しい名言リストをキャッシュに追加します。
   * 上限（100件）を超える場合、古い名言（配列先頭）から順に破棄されます。
   */
  public addQuotes = (newQuotes: Quote[]) => {
    const combined = [...this.quotes, ...newQuotes];
    if (combined.length > MAX_CACHE_SIZE) {
      this.quotes = combined.slice(combined.length - MAX_CACHE_SIZE);
    } else {
      this.quotes = combined;
    }

    this.notifyListeners();
    this.resetExpirationTimer(); // 追加時にタイマーをリセット
  };

  /**
   * キャッシュを強制的にクリアします。
   */
  public clear = () => {
    if (this.quotes.length === 0) return;
    this.quotes = [];
    this.notifyListeners();
  };

  // --- Internals ---

  private notifyListeners = () => {
    for (const listener of this.listeners) {
      listener();
    }
  };

  /**
   * 1時間の揮発タイマーをリセットし、再スタートさせます。
   */
  private resetExpirationTimer = () => {
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }
    this.expirationTimer = setTimeout(() => {
      this.clear();
    }, EXPIRATION_TIME_MS);
  };

  /**
   * アプリの状態変化（バックグラウンド移行など）を監視します。
   */
  private setupAppStateListener = () => {
    this.appStateSubscription = AppState.addEventListener(
      "change",
      this.handleAppStateChange,
    );
  };

  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    // アプリがバックグラウンドに移行した場合、即座にキャッシュを破棄する
    if (nextAppState === "background") {
      this.clear();
    } else if (nextAppState === "active") {
      // アクティブに戻った際に揮発タイマーを再セット
      this.resetExpirationTimer();
    }
  };
}

// シングルトンインスタンスとしてエクスポート
export const quoteStore = new QuoteStore();
