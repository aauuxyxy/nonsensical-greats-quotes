export const colors = {
  primary: "#0A192F", // 深みのあるネイビー（背景色）
  secondary: "#D4AF37", // ゴールド（アクセントカラー）
  text: {
    primary: "#F8FAFC", // 白（主要テキスト）
    secondary: "#94A3B8", // グレー（サブテキスト、日付等）
    accent: "#D4AF37", // ゴールド（偉人の名前等）
  },
  background: {
    main: "#0A192F",
    card: "rgba(255, 255, 255, 0.05)", // ガラスモーフィズム用
  },
  border: {
    light: "rgba(212, 175, 55, 0.2)", // ゴールドの薄い枠線
  },
  // 羊皮紙（レトロ）デザイン用
  retro: {
    parchment: "#F5E6CA", // 羊皮紙のベースカラー
    parchmentDark: "#E8D5B5", // 羊皮紙の影・質感用
    ink: "#2C1E11", // 古いインクの色
    border: "#8B5E3C", // 古い本の縁のような色
  },
} as const;

export type Colors = typeof colors;
