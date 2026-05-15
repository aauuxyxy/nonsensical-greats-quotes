# データモデル・型定義 (API Schema) - 偉人の迷言アプリ

## 1. データモデル

### 名言データ (Quote)
LLMから出力される、およびアプリ内で管理される名言の基本構造。

```typescript
interface Quote {
  id: string;          // 一意なID (UUID v4)
  content: string;     // 名言本文
  author: string;      // 架空の偉人名
  title: string;       // 偉人の肩書き (例: 世紀の迷走家, 昼寝の先駆者)
  createdAt: number;   // 生成タイムスタンプ
}
```

## 2. LLM プロンプト定義

### システムプロンプト (System Prompt)
```text
あなたは「意味のない名言」を生成する専門家です。
以下の制約を厳守してJSON形式で出力してください。

1. 名前、肩書き、名言の内容はすべて日本語。
2. 名前と肩書きは「架空の人物」であること。実在の人物は絶対に使わない。
3. 内容は一見深そうだが、冷静に考えると全く意味がなく、くだらないものであること。
4. 出力は以下のJSON配列形式のみで行うこと。
   [{"author": "...", "title": "...", "content": "..."}]
```

## 3. キャッシュ管理 (State)
```typescript
interface QuoteState {
  items: Quote[];      // 最大100件の配列
  isGenerating: boolean; // LLMがバックグラウンドで稼働中か
  lastClearedAt: number; // 最終キャッシュクリア時刻
}
```
