import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { usePressScale } from '../hooks/usePressScale';
import { theme } from '../constants/theme';
import type { IconComponent } from './PrimaryButton';

// Same icon size as PrimaryButton — icon sizes never differ within a screen.
const ICON_SIZE = 24;
const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconComponent;
  height?: number;
  tint?: string;
};

export function SecondaryButton({
  label,
  onPress,
  Icon,
  height = 48,
  tint = theme.colors.text.primary,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SLOP}
      style={[styles.press, { height }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.fill, { height, transform: [{ scale }] }]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON_SIZE} strokeWidth={1.8} color={tint} /> : null}
          <Text style={[styles.label, { color: tint }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    borderRadius: 14,
  },
  fill: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: theme.colors.ui.glass,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.1,
    lineHeight: ICON_SIZE,
  },
});
