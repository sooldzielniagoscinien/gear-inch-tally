import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';

type Props = {
  width: number;
  gears: number[];
  min: number;
  max: number;
  color: string;
  delay?: number;
  height?: number;
};

/**
 * Track + animated fill + a tick per gear.
 * The fill is scaled on the X axis (native driver) — never an animated width.
 */
export function RangeBar({
  width,
  gears,
  min,
  max,
  color,
  delay = 0,
  height = 10,
}: Props) {
  const grow = useRef(new Animated.Value(0)).current;

  const span = max - min || 1;
  const low = Math.min(...gears);
  const high = Math.max(...gears);
  const startPct = (low - min) / span;
  const endPct = (high - min) / span;
  const fillW = Math.max(4, (endPct - startPct) * width);
  const fillX = startPct * width;

  const ticks = useMemo(
    () =>
      gears.map((g, i) => ({
        key: 'tick-' + i + '-' + g,
        x: Math.min(width - 2, Math.max(0, ((g - min) / span) * width)),
      })),
    [gears, min, span, width],
  );

  useEffect(() => {
    grow.setValue(0);
    Animated.timing(grow, {
      toValue: 1,
      duration: theme.animation.bar,
      delay,
      useNativeDriver: true,
    }).start();
  }, [grow, delay, fillW]);

  return (
    <View style={[styles.track, { width, height, borderRadius: height / 2 }]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.fill,
          {
            width: fillW,
            height,
            left: fillX,
            borderRadius: height / 2,
            transform: [
              { translateX: -fillW / 2 },
              { scaleX: grow },
              { translateX: fillW / 2 },
            ],
          },
        ]}>
        <LinearGradient
          colors={[color, color + '66']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.grad, { borderRadius: height / 2 }]}
        />
      </Animated.View>
      {ticks.map(t => (
        <View key={t.key} pointerEvents="none" style={[styles.tick, { left: t.x, height }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: 'rgba(237,242,244,0.10)',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 0,
  },
  grad: {
    width: '100%',
    height: '100%',
  },
  tick: {
    position: 'absolute',
    top: 0,
    width: 2,
    backgroundColor: theme.colors.text.primary,
    opacity: 0.85,
  },
});
