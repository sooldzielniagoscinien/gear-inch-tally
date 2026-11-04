import React, { memo, useCallback } from 'react';
import { Animated, Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { usePressScale } from '../hooks/usePressScale';
import { theme } from '../constants/theme';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const MINI_W = 84;

type Props = {
  index: number;
  name: string;
  spec: string;
  rangePct: number;
  sprite: ImageSourcePropType;
  onPress: (index: number) => void;
};

export const BikeRow = memo(function BikeRow({
  index,
  name,
  spec,
  rangePct,
  sprite,
  onPress,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);
  const handlePress = useCallback(() => onPress(index), [onPress, index]);
  const fillW = Math.max(8, Math.min(MINI_W, (rangePct / 600) * MINI_W));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name + ', ' + spec}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SLOP}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.fill, { transform: [{ scale }] }]}>
        <Image source={sprite} style={styles.sprite} resizeMode="contain" />
        <View style={styles.textCol}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.spec} numberOfLines={1}>
            {spec}
          </Text>
        </View>
        <View style={styles.rangeCol}>
          <View style={styles.miniTrack}>
            <View style={[styles.miniFill, { width: fillW }]} />
          </View>
          <Text style={styles.pct}>{Math.round(rangePct)}%</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 72,
    borderRadius: 18,
  },
  fill: {
    width: '100%',
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
    borderRadius: 18,
    backgroundColor: theme.colors.ui.glass,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  sprite: {
    width: 44,
    height: 44,
  },
  textCol: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.text.primary,
  },
  spec: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  rangeCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  miniTrack: {
    width: MINI_W,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(237,242,244,0.10)',
    overflow: 'hidden',
  },
  miniFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accent.primary,
  },
  pct: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.accent.primary,
    fontVariant: ['tabular-nums'],
  },
});
