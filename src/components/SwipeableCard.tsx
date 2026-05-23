import React, { useRef } from 'react';
import { StyleSheet, Dimensions, PanResponder, Animated } from 'react-native';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.4;

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipe: () => void;
}

/**
 * [SIMPLE UI] Reanimatedを使用せず、標準のPanResponderとAnimatedで実装したスワイプ可能なカード。
 * HostFunctionのエラーを回避し、安定した動作を優先しています。
 */
export const SwipeableCard: React.FC<SwipeableCardProps> = ({ children, onSwipe }) => {
  // アニメーション値の初期化
  const pan = useRef(new Animated.ValueXY()).current;

  // ジェスチャーハンドラーの設定
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        // 現在のドラッグ位置を反映
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (e, gestureState) => {
        if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
          // スワイプアウト判定（画面外へ）
          Animated.timing(pan, {
            toValue: { 
              x: gestureState.dx > 0 ? width * 1.2 : -width * 1.2, 
              y: gestureState.dy 
            },
            duration: 200,
            useNativeDriver: false, // translateX/Y以外も扱うためfalse
          }).start(() => {
            onSwipe();
            // 値をリセットして次のカードに備える
            pan.setValue({ x: 0, y: 0 });
          });
        } else {
          // 閾値未満なら元の位置に戻る
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // 回転アニメーションの補間
  const rotate = pan.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { rotate: rotate },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
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
