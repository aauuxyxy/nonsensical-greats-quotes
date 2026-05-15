# データモデル・型定義 (API Schema) - 偉人の迷言アプリ

## 1. データモデル

### 名言データ (Quote)
LLMから出力される、およびアプリ内で管理される名言の基本構造。

```typescript
interface Quote {
  id: string;          // 一意なID (UUID v4)
  content: string;     // 名言本文
  author: string;      // 架空の偉人名（歴史的に実在しそうな厳かな名前）
  title: string;       // 偉人の肩書き (例: 世紀の観測者)
  birthYear: number;   // 誕生年
  deathYear: number;   // 没年
  createdAt: number;   // 生成タイムスタンプ
}
```

## 2. LLM プロンプト定義

### システムプロンプト (System Prompt)
```text
あなたは「歴史に名を残した架空の偉人による、深そうで全く意味のない名言」を生成する専門家です。
以下の制約を厳守してJSON形式で出力してください。

1. 【名前】: 歴史的に実在しそうな、重厚で厳かな名前を日本語で生成してください（例: アレクサンデル・フォン・ヘルマン）。名前自体にギャグ要素（「二度寝」など）を入れないでください。
2. 【肩書き】: 偉人らしい威厳のある肩書きにしてください（例: 静寂の観測者, 概念の解体者）。
3. 【生没年】: 1000年〜1950年の間で、妥当な生涯期間（例: 60〜90年間）を生成してください。
4. 【内容】: 読み手に「深い知恵がある」と一瞬錯覚させ、その直後に「いや、何だこれ？」と思わせる、くだらなくてユーモア溢れる内容にしてください。
5. 出力形式: 
   [{"author": "...", "title": "...", "birthYear": 1840, "deathYear": 1910, "content": "..."}]
```

## 3. キャッシュ管理 (State)
```typescript
interface QuoteState {
  items: Quote[];      // 最大100件の配列
  isGenerating: boolean; // LLMがバックグラウンドで稼働中か
  lastClearedAt: number; // 最終キャッシュクリア時刻
}
```
