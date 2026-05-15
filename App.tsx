import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider, useTheme } from "./src/theme/ThemeProvider";

import { useEffect } from "react";
import { BatchGenerator } from "./src/services/llm/BatchGenerator";
import { QuoteStack } from "./src/components/QuoteStack";

// 内部コンポーネント: フックを使ってテーマにアクセス
const AppContent = () => {
  const theme = useTheme();

  useEffect(() => {
    // バッチ生成エンジンの監視（および初期補充）を開始
    BatchGenerator.initialize();
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background.main }]}
    >
      {/* ヘッダーエリア */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text.accent }]}>
          偉人の迷言
        </Text>
      </View>

      {/* メインコンテンツ: 名言カードスタック */}
      <View style={styles.stackContainer}>
        <QuoteStack />
      </View>

      {/* フッター/ガイド */}
      <View style={styles.footer}>
        <Text style={[styles.guideText, { color: theme.text.secondary }]}>
          左右にスワイプして次の迷言へ
        </Text>
      </View>

      <StatusBar style="light" />
    </View>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "serif",
    letterSpacing: 2,
  },
  stackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  guideText: {
    fontSize: 14,
    fontFamily: "serif",
    opacity: 0.6,
  },
});
