import React, { createContext, useContext, ReactNode } from "react";
import { colors, Colors } from "./colors";

// テーマのコンテキストを作成
const ThemeContext = createContext<Colors>(colors);

// プロバイダーコンポーネント
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeContext.Provider value={colors}>{children}</ThemeContext.Provider>
  );
};

// カスタムフック: どこからでもテーマ色を呼び出せるようにする
export const useTheme = () => {
  return useContext(ThemeContext);
};
