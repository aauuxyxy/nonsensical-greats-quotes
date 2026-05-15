import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
// スワイプアウトと判定する閾値
const SWIPE_THRESHOLD = width * 0.35;

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipe: () => void; // スワイプ完了時のコールバック
}

/**
 * カードをスワイプ可能にするラッパーコンポーネント。
 * PanGestureとReanimatedを組み合わせて、滑らかな移動と回転を実現します。
 */
export const SwipeableCard: React.FC<SwipeableCardProps> = ({ children, onSwipe }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // ジェスチャーハンドラーの定義
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        // 横方向に大きくスワイプされた場合、画面外へ飛ばす
        const destX = event.translationX > 0 ? width * 1.5 : -width * 1.5;
        translateX.value = withTiming(destX, { duration: 300 }, () => {
          runOnJS(onSwipe)();
          // コールバック後に位置をリセット
          translateX.value = 0;
          translateY.value = 0;
        });
      } else {
        // 閾値以下の場合はバネの動きで元の位置に戻る
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
      }
    });

  // アニメーションスタイルの計算
  const animatedStyle = useAnimatedStyle(() => {
    // 横移動に応じて回転を加える（レトロなカードが舞うような演出）
    const rotate = interpolate(
      translateX.value,
      [-width, 0, width],
      [-25, 0, 25],
      Extrapolation.CLAMP
    );

    // スワイプアウトに近づくにつれて不透明度を下げる
    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, width * 0.5],
      [1, 0.3],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
      opacity,
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.wrapper, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
