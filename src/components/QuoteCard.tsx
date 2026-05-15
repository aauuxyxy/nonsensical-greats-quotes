import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Quote } from '../types/Quote';
import { colors } from '../theme/colors';

/**
 * 偉人の迷言を表示するためのカードコンポーネント。
 * 古い羊皮紙を思わせるレトロでプレミアムなデザインを採用しています。
 */

interface QuoteCardProps {
  quote: Quote;
}

const { width } = Dimensions.get('window');

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  // 生没年の表示文字列を作成
  const years = quote.birthYear !== null && quote.deathYear !== null
    ? `${quote.birthYear} - ${quote.deathYear}`
    : quote.birthYear !== null
    ? `${quote.birthYear} - ?`
    : quote.deathYear !== null
    ? `? - ${quote.deathYear}`
    : '';

  return (
    <View style={styles.container}>
      {/* 羊皮紙の質感をシミュレートする背景（SVGグラデーション） */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="parchmentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.retro.parchment} stopOpacity="1" />
              <Stop offset="40%" stopColor={colors.retro.parchmentDark} stopOpacity="1" />
              <Stop offset="60%" stopColor={colors.retro.parchmentDark} stopOpacity="1" />
              <Stop offset="100%" stopColor={colors.retro.parchment} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          {/* メインの背景 */}
          <Rect x="0" y="0" width="100" height="100" fill="url(#parchmentGrad)" />
          
          {/* 装飾的な内枠 */}
          <Rect
            x="4"
            y="4"
            width="92"
            height="92"
            fill="none"
            stroke={colors.retro.border}
            strokeWidth="0.5"
            strokeDasharray="1,1"
            opacity={0.4}
          />
        </Svg>
      </View>

      {/* コンテンツレイアウト */}
      <View style={styles.content}>
        {/* 迷言本文 */}
        <Text style={styles.quoteText}>“{quote.content}”</Text>
        
        {/* 偉人情報セクション */}
        <View style={styles.footer}>
          <View style={styles.divider} />
          <Text style={styles.authorName}>{quote.author}</Text>
          <Text style={styles.authorTitle}>{quote.title}</Text>
          {years ? <Text style={styles.years}>{years}</Text> : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    minHeight: 280,
    padding: 30,
    marginVertical: 15,
    borderRadius: 4, // 羊皮紙っぽく角を少しだけ丸める
    overflow: 'hidden',
    // シャドウ設定（レトロな重厚感）
    backgroundColor: colors.retro.parchment,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 24,
    color: colors.retro.ink,
    textAlign: 'center',
    fontFamily: 'serif', // 明朝体に近いセリフ体
    lineHeight: 38,
    marginBottom: 24,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    width: '100%',
  },
  divider: {
    width: 80,
    height: 1,
    backgroundColor: colors.retro.border,
    marginBottom: 16,
    opacity: 0.6,
  },
  authorName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: colors.retro.ink,
    fontFamily: 'serif',
    marginBottom: 6,
    letterSpacing: 1,
  },
  authorTitle: {
    fontSize: 14,
    color: colors.retro.ink,
    opacity: 0.85,
    fontFamily: 'serif',
    marginBottom: 4,
  },
  years: {
    fontSize: 12,
    color: colors.retro.ink,
    opacity: 0.7,
    fontFamily: 'serif',
    fontStyle: 'italic',
  },
});
