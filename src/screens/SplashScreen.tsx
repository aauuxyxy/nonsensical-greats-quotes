import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useAppStore } from '../store/AppStore';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

/**
 * アプリ起動時に表示されるスプラッシュ兼ロード画面。
 * AIモデルのロード進捗を視覚化し、プレミアムな期待感を演出します。
 */
export const SplashScreen: React.FC = () => {
  const { loadProgress } = useAppStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // ふわっと浮き上がるようなアニメーション
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content, 
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Text style={styles.title}>偉人の迷言</Text>
        <Text style={styles.subtitle}>古の叡智（モデル）を召喚中...</Text>
        
        {/* 進捗バー */}
        <View style={styles.progressWrapper}>
          <View style={styles.progressTrack}>
            <Animated.View 
              style={[
                styles.progressBar, 
                { width: `${loadProgress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{Math.round(loadProgress)}%</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by Gemma 2</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary, // 深みのあるネイビー
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: width * 0.8,
  },
  title: {
    fontSize: 48,
    color: colors.secondary, // ゴールド
    fontFamily: 'serif',
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 6,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    fontFamily: 'serif',
    marginBottom: 60,
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  progressWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(212, 175, 55, 0.1)', // 薄いゴールド
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  progressText: {
    marginTop: 12,
    color: colors.secondary,
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: '500',
  },
  footer: {
    marginTop: 100,
    opacity: 0.5,
  },
  footerText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontFamily: 'serif',
    letterSpacing: 2,
  },
});
