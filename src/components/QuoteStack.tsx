import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useQuoteStore } from '../store/QuoteStore';
import { QuoteCard } from './QuoteCard';
import { SwipeableCard } from './SwipeableCard';
import { useTheme } from '../theme/ThemeProvider';

/**
 * 名言カードのスタックを管理するコンポーネント。
 * 現在表示中のカードと、その背後に控える次の一枚を制御します。
 */
export const QuoteStack: React.FC = () => {
  const { quotes, popQuote } = useQuoteStore();
  const theme = useTheme();

  // キャッシュが空の場合の表示
  if (quotes.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.text.accent} />
        <Text style={[styles.loadingText, { color: theme.text.secondary }]}>
          新たな迷言を降臨させています...
        </Text>
      </View>
    );
  }

  // 背面のカード（視覚効果用）
  const nextQuote = quotes.length > 1 ? quotes[1] : null;
  // 前面の操作対象カード
  const currentQuote = quotes[0];

  return (
    <View style={styles.container}>
      {/* 背面のカード: 少し小さく、不透明度を下げて配置 */}
      {nextQuote && (
        <View style={styles.backCardContainer}>
          <View style={styles.backCard}>
            <QuoteCard quote={nextQuote} />
          </View>
        </View>
      )}

      {/* 前面のカード: スワイプ操作が可能 */}
      <SwipeableCard onSwipe={popQuote}>
        <QuoteCard quote={currentQuote} />
      </SwipeableCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'serif',
  },
  backCardContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backCard: {
    opacity: 0.4,
    transform: [
      { scale: 0.92 },
      { translateY: 15 },
    ],
  },
});
