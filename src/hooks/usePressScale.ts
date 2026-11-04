import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { theme } from '../constants/theme';

/**
 * Press feedback for a Pressable. The Pressable stays the PARENT and the
 * Animated.View lives inside it — the other way round swallows onPress on
 * Android release builds.
 */
export function usePressScale(pressedScale: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: pressedScale,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale, pressedScale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}
