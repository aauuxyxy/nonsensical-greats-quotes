import { FilesetResolver, LlmInference } from "@mediapipe/tasks-genai";

/**
 * MediaPipeのLLM推論APIを管理するシングルトンクラス。
 * Gemma-2b等のローカルモデルのロードと推論実行を担当します。
 */
class MediaPipeManager {
  private static instance: MediaPipeManager;
  private llmInference: LlmInference | null = null;
  private isInitializing: boolean = false;

  private constructor() {}

  // シングルトンインスタンスの取得
  public static getInstance(): MediaPipeManager {
    if (!MediaPipeManager.instance) {
      MediaPipeManager.instance = new MediaPipeManager();
    }
    return MediaPipeManager.instance;
  }

  /**
   * モデルを非同期でメモリにロードします。
   * @param modelUrl デバイス内またはバンドルされたモデルパス
   * @param onProgress ロード進捗を受け取るコールバック (0-100)
   */
  public async initialize(
    modelUrl: string,
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    // 既に初期化中、または初期化済みの場合は重複実行を防ぐ
    if (this.llmInference || this.isInitializing) return;
    this.isInitializing = true;

    try {
      onProgress?.(10);

      // 1. WASMファイルセットの解決
      // モバイル環境やブラウザでの実行に必要なバイナリをロードする
      const fileset = await FilesetResolver.forGenAiTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/wasm",
      );

      onProgress?.(50);

      // 2. LLM推論エンジンの生成
      // temperatureを少し高めに設定し、名言の「くだらなさ」や多様性を引き出す意図
      this.llmInference = await LlmInference.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: modelUrl,
        },
        maxTokens: 512,
        topK: 40,
        temperature: 0.8,
      });

      onProgress?.(100);
    } catch (error) {
      console.error("Failed to initialize MediaPipe LLM:", error);
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * プロンプトを渡してモデルから応答を取得します。
   * (実際の推論メソッド。バッチ生成等で呼び出される想定)
   */
  public async generateResponse(prompt: string): Promise<string> {
    if (!this.llmInference) {
      throw new Error("LLM Inference is not initialized yet.");
    }
    return await this.llmInference.generateResponse(prompt);
  }

  // 初期化が完了しているかの確認用
  public isLoaded(): boolean {
    return this.llmInference !== null;
  }
}

export default MediaPipeManager.getInstance();
