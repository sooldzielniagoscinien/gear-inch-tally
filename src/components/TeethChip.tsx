import React, { memo, useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { usePressScale } from '../hooks/usePressScale';
import { theme } from '../constants/theme';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  value: number;
  active: boolean;
  onPress: (value: number) => void;
  size?: number;
  suffix?: string;
};

/** The 56px chainring / cog selector. */
export const TeethChip = memo(function TeethChip({
  value,
  active,
  onPress,
  size = 56,
  suffix = '',
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.93);
  const handlePress = useCallback(() => onPress(value), [onPress, value]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={value + suffix}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SLOP}
      style={[styles.press, { width: size, height: size }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.fill,
          active ? styles.fillActive : styles.fillIdle,
          { width: size, height: size, transform: [{ scale }] },
        ]}>
        <Text style={[styles.text, active ? styles.textActive : null]} numberOfLines={1}>
          {value + suffix}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  press: {
    borderRadius: 14,
  },
  fill: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  fillIdle: {
    backgroundColor: theme.colors.ui.glass,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  fillActive: {
    backgroundColor: 'rgba(46,196,182,0.16)',
    borderColor: theme.colors.accent.primary,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  textActive: {
    color: theme.colors.accent.primary,
    fontWeight: '800',
  },
});
