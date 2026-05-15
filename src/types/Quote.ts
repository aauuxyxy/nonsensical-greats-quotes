export type Quote = {
  id: string; // クライアント側で生成する一意のID
  content: string; // 迷言内容
  author: string; // 厳粛な偉人名
  title: string; // 肩書き (例: 19世紀の思想家)
  birthYear: number | null; // 誕生年 (例: 1805)
  deathYear: number | null; // 没年 (例: 1888)
  createdAt: number; // Unix timestamp
};
