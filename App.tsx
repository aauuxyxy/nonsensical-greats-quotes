import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider, useTheme } from "./src/theme/ThemeProvider";

import React, { useEffect } from "react";
import { QuoteStack } from "./src/components/QuoteStack";

import { useAppStore } from "./src/store/AppStore";
import { SplashScreen } from "./src/screens/SplashScreen";

const AppContent = () => {
  const theme = useTheme();
  const isInitialized = useAppStore((state) => state.isInitialized);
  
  useEffect(() => {
    // LLM初期化処理の代わりに、仮で初期化完了とする
    // ※ 実際のJSONデータ読み込みロジックは Issue #24 で実装
    setTimeout(() => {
      useAppStore.getState().setInitialized(true);
    }, 500); // SplashScreenを見せるための少しの遅延
  }, []);

  return (
    <View style={styles.root}>
      {isInitialized ? (
        <View style={[styles.container, { backgroundColor: theme.background.main }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text.accent }]}>
              偉人の迷言
            </Text>
          </View>

          <View style={styles.stackContainer}>
            <QuoteStack />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.guideText, { color: theme.text.secondary }]}>
              左右にスワイプして次の迷言へ
            </Text>
          </View>
        </View>
      ) : (
        <SplashScreen />
      )}
      
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
  root: {
    flex: 1,
  },
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
