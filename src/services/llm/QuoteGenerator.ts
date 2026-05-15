import MediaPipeManager from "./MediaPipeManager";
import { Quote } from "../../types/Quote";

// UUID生成用の簡易関数
// （依存ライブラリを減らすための軽量な実装）
const generateId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// LLMに対するシステムプロンプト。
// 名前の厳格さと、内容のくだらなさのギャップを意図して指示を出しています。
const SYSTEM_PROMPT = `
あなたは歴史上の偉人になりきって名言を生成するAIです。以下の厳密なルールに従って、JSON形式で出力してください。

【ルール】
1. author: 実在しそうな重厚で厳格な名前を生成してください（ギャグやふざけた要素は一切禁止）。
2. title: その人物の肩書き（例：「19世紀の思想家」「古代ローマの哲学者」など）。
3. content: 一見すると非常に深く哲学的に見えますが、よく考えると全く意味がない、または非常にくだらない内容にしてください。
4. birthYear: 1000〜1950の間のランダムな年。
5. deathYear: birthYearから30〜90年後の年。
6. 返答は必ず以下のJSON配列のみとし、それ以外の文章やマークダウンを含めないこと。

【出力形式】
[
  {
    "author": "アレクサンドル・フォン・ヴィルヘルム",
    "title": "18世紀の錬金術師",
    "content": "明日できることを今日やる者は、今日できることを明日やる者と同じくらい、今日と明日を生きている。",
    "birthYear": 1742,
    "deathYear": 1812
  }
]
`;

export class QuoteGenerator {
  /**
   * LLMにプロンプトを送信し、名言リストを生成します。
   * @param count 生成する件数 (デフォルトは1件ですが、バッチ生成の場合は複数件を要求します)
   */
  public static async generate(count: number = 1): Promise<Quote[]> {
    const prompt = `${SYSTEM_PROMPT}\n\n上記ルールに従い、${count}件の名言を生成してください。`;

    try {
      // MediaPipeManagerを通じてLLMからテキストを生成
      const responseText = await MediaPipeManager.generateResponse(prompt);

      // 出力されたテキストをJSONとしてパースし、型チェックと補完を行う
      return this.parseAndValidate(responseText);
    } catch (error) {
      console.error("Failed to generate quotes:", error);
      return []; // エラー時はアプリがクラッシュしないよう空配列を返す
    }
  }

  /**
   * LLMの出力をパースし、不完全なJSONの修正や型チェックを行います。
   */
  private static parseAndValidate(rawText: string): Quote[] {
    let jsonString = rawText.trim();

    // LLMがマークダウンのコードブロック（\`\`\`json ... \`\`\`）を含めてきた場合の除去処理
    if (jsonString.startsWith("\`\`\`")) {
      const match = jsonString.match(/\`\`\`(?:json)?\s*([\s\S]*?)\s*\`\`\`/);
      if (match && match[1]) {
        jsonString = match[1];
      }
    }

    try {
      const parsed = JSON.parse(jsonString);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      // filterとmapを用いて非破壊的な配列操作を行う
      return items
        .filter(
          (item: any) =>
            typeof item.author === "string" && typeof item.content === "string",
        )
        .map(
          (item: any): Quote => ({
            id: generateId(),
            author: item.author,
            title: item.title || "身元不明の賢者",
            content: item.content,
            birthYear:
              typeof item.birthYear === "number" ? item.birthYear : null,
            deathYear:
              typeof item.deathYear === "number" ? item.deathYear : null,
            createdAt: Date.now(),
          }),
        );
    } catch (e) {
      console.error(
        "Failed to parse JSON response:",
        e,
        "\\nRaw Text:",
        rawText,
      );
      // JSONが壊れていた場合はパースを諦め、空配列を返す（将来的には再生成や正規表現での抽出等も検討）
      return [];
    }
  }
}
