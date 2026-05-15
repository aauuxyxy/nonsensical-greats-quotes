import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>偉人の迷言アプリ</Text>
      <Text style={styles.subtext}>Initialization Complete</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A192F", // テーマカラーのネイビー
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#D4AF37", // ゴールド
    fontSize: 24,
    fontWeight: "bold",
  },
  subtext: {
    color: "#94A3B8",
    fontSize: 14,
    marginTop: 8,
  },
});
