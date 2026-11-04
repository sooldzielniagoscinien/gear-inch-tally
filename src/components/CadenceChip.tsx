import React, { memo, useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { usePressScale } from '../hooks/usePressScale';
import { theme } from '../constants/theme';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  rpm: number;
  active: boolean;
  width: number;
  onPress: (rpm: number) => void;
};

export const CadenceChip = memo(function CadenceChip({
  rpm,
  active,
  width,
  onPress,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.94);
  const handlePress = useCallback(() => onPress(rpm), [onPress, rpm]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={rpm + ' RPM'}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SLOP}
      style={[styles.press, { width, height: 44 }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.fill,
          active ? styles.fillActive : styles.fillIdle,
          { width, height: 44, transform: [{ scale }] },
        ]}>
        <Text style={[styles.text, active ? styles.textActive : null]} numberOfLines={1}>
          {rpm}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  press: {
    borderRadius: 12,
  },
  fill: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  fillIdle: {
    backgroundColor: theme.colors.ui.glass,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  fillActive: {
    backgroundColor: 'rgba(255,159,28,0.14)',
    borderColor: theme.colors.accent.secondary,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  textActive: {
    color: theme.colors.accent.secondary,
    fontWeight: '800',
  },
});
