import { useState, useEffect } from "react";
import MediaPipeManager from "../services/llm/MediaPipeManager";

/**
 * モデルロードの状態と進捗を管理するカスタムフック。
 * SplashScreen等で利用して、UIにロード進捗（プログレスバー等）を反映させる意図で作成。
 *
 * @param modelUrl デバイス内またはバンドルされたモデルへのパス
 */
export const useLLMLoader = (modelUrl: string) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // コンポーネントがアンマウントされた際のステート更新を防ぐフラグ
    let isMounted = true;

    const loadModel = async () => {
      try {
        // まだロードされていない場合のみ初期化を実行
        if (!MediaPipeManager.isLoaded()) {
          await MediaPipeManager.initialize(modelUrl, (p) => {
            if (isMounted) setProgress(p);
          });
        }

        // ロード完了時の状態更新
        if (isMounted) {
          setProgress(100);
          setIsLoaded(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error("Unknown error during LLM loading"),
          );
        }
      }
    };

    loadModel();

    return () => {
      isMounted = false;
    };
  }, [modelUrl]);

  return { progress, isLoaded, error };
};
