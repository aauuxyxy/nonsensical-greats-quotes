import { QuoteGenerator } from "./QuoteGenerator";
import { useQuoteStore } from "../../store/QuoteStore";

const TARGET_BATCH_COUNT = 30;
const GENERATE_PER_TICK = 5; // LLMの出力制限やJSON破損リスクを抑えるため、5件ずつ分割生成
const LOW_WATER_MARK = 10; // キャッシュ残量が10件以下になったら自動補充を開始

/**
 * バックグラウンドでLLMを稼働させ、名言キャッシュを自動補充するバッチ処理エンジン。
 * UIスレッドをブロックしないよう、Zustandストアを監視して非同期で動作します。
 */
export class BatchGenerator {
  private static isGenerating = false;
  private static unsubscribe: (() => void) | null = null;

  /**
   * QuoteStoreの監視を開始し、必要に応じて自動バッチ生成をトリガーします。
   * アプリ起動時に一度だけ呼び出してください。
   */
  public static initialize() {
    if (this.unsubscribe) return;

    // Zustandのストアを購読し、名言が減少したタイミングを検知
    this.unsubscribe = useQuoteStore.subscribe((state) => {
      if (state.quotes.length <= LOW_WATER_MARK && !this.isGenerating) {
        this.runBatch();
      }
    });

    // 初期化直後にも件数チェックを行い、空であれば即座に補充を開始
    const currentQuotes = useQuoteStore.getState().quotes;
    if (currentQuotes.length <= LOW_WATER_MARK && !this.isGenerating) {
      this.runBatch();
    }
  }

  /**
   * バッチ生成を非同期で実行します。
   * 二重起動を防ぐためのロック機構（isGeneratingフラグ）を備えています。
   */
  private static async runBatch() {
    if (this.isGenerating) return;
    this.isGenerating = true;

    try {
      console.log(
        `[BatchGenerator] キャッシュ不足のため、${TARGET_BATCH_COUNT}件の補充を開始します...`,
      );
      let generatedCount = 0;
      let consecutiveErrors = 0;

      // 30件を一気に生成せず、5件ずつ生成を繰り返すことで
      // メモリ逼迫とLLM出力のJSON途切れを防ぐ
      while (generatedCount < TARGET_BATCH_COUNT) {
        const requestCount = Math.min(
          GENERATE_PER_TICK,
          TARGET_BATCH_COUNT - generatedCount,
        );
        const newQuotes = await QuoteGenerator.generate(requestCount);

        if (newQuotes.length === 0) {
          consecutiveErrors++;
          console.warn(
            `[BatchGenerator] 名言の生成に失敗しました（連続エラー: ${consecutiveErrors}回）`,
          );

          if (consecutiveErrors >= 5) {
            console.error(
              "[BatchGenerator] 連続エラー上限に達したため、今回のバッチ補充を中断します。",
            );
            break; // 無限ループによるバッテリー枯渇やクラッシュを防止
          }

          // エラー時は少し待機してからリトライ
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          // 生成成功分を直ちにストアへ格納し、UIに即座に反映させる
          useQuoteStore.getState().addQuotes(newQuotes);
          generatedCount += newQuotes.length;
          consecutiveErrors = 0; // 成功したらエラーカウントをリセット
          console.log(
            `[BatchGenerator] ${newQuotes.length}件生成完了（計: ${generatedCount}/${TARGET_BATCH_COUNT}件）`,
          );
        }
      }

      console.log("[BatchGenerator] バッチ補充サイクルが完了しました。");
    } catch (error) {
      console.error(
        "[BatchGenerator] バッチ処理中に致命的なエラーが発生しました:",
        error,
      );
    } finally {
      // 終了時（または中断時）にロックを解放し、次回以降のトリガーを許可する
      this.isGenerating = false;
    }
  }
}
