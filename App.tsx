import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider, useTheme } from "./src/theme/ThemeProvider";

import { useEffect } from "react";
import { BatchGenerator } from "./src/services/llm/BatchGenerator";

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
      <Text style={[styles.text, { color: theme.text.accent }]}>
        偉人の迷言アプリ
      </Text>
      <Text style={[styles.subtext, { color: theme.text.secondary }]}>
        LLM Batch Engine Initialized
      </Text>
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
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtext: {
    fontSize: 14,
    marginTop: 8,
  },
});
