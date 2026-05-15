import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider, useTheme } from "./src/theme/ThemeProvider";

// 内部コンポーネント: フックを使ってテーマにアクセス
const AppContent = () => {
  const theme = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.background.main }]}
    >
      <Text style={[styles.text, { color: theme.text.accent }]}>
        偉人の迷言アプリ
      </Text>
      <Text style={[styles.subtext, { color: theme.text.secondary }]}>
        Libraries & Theme Initialized
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
