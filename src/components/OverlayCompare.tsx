import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { assets } from '../assets';
import { BentoTile } from './BentoTile';
import { theme } from '../constants/theme';
import { DrivetrainSummary } from '../game/compare';
import { fmtPct } from '../utils/format';
import { RangeBar } from './RangeBar';

type Props = {
  a: DrivetrainSummary;
  b: DrivetrainSummary;
  min: number;
  max: number;
  duplicatePositions: number[];
  barWidth: number;
};

export function OverlayCompare({ a, b, min, max, duplicatePositions, barWidth }: Props) {
  const pop = useRef(new Animated.Value(0)).current;
  const span = max - min || 1;

  useEffect(() => {
    pop.setValue(0);
    Animated.sequence([
      Animated.delay(520),
      Animated.spring(pop, {
        toValue: 1,
        tension: 60,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pop, duplicatePositions]);

  return (
    <BentoTile style={styles.card}>
      <View style={styles.block}>
        <View style={styles.legend}>
          <Image source={assets.sprite1} style={styles.sprite} resizeMode="contain" />
          <Text style={styles.name} numberOfLines={1}>
            {a.label}
          </Text>
          <Text style={[styles.pct, { color: theme.colors.accent.primary }]}>
            {fmtPct(a.rangePct)}
          </Text>
        </View>
        <RangeBar
          width={barWidth}
          gears={a.gears}
          min={min}
          max={max}
          color={theme.colors.accent.primary}
          delay={0}
        />
      </View>

      <View style={styles.dupeRow}>
        {duplicatePositions.map((g, i) => (
          <Animated.View
            key={'dupe-' + i + '-' + Math.round(g * 10)}
            pointerEvents="none"
            style={[
              styles.dupeDot,
              {
                left: Math.min(barWidth - 6, Math.max(0, ((g - min) / span) * barWidth)),
                transform: [{ scale: pop }],
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.block}>
        <View style={styles.legend}>
          <Image source={assets.sprite2} style={styles.sprite} resizeMode="contain" />
          <Text style={styles.name} numberOfLines={1}>
            {b.label}
          </Text>
          <Text style={[styles.pct, { color: theme.colors.accent.secondary }]}>
            {fmtPct(b.rangePct)}
          </Text>
        </View>
        <RangeBar
          width={barWidth}
          gears={b.gears}
          min={min}
          max={max}
          color={theme.colors.accent.secondary}
          delay={120}
        />
      </View>
    </BentoTile>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  block: {
    gap: 8,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sprite: {
    width: 28,
    height: 28,
  },
  name: {
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
  },
  pct: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
    fontVariant: ['tabular-nums'],
  },
  dupeRow: {
    height: 14,
    marginVertical: 2,
    justifyContent: 'center',
  },
  dupeDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accent.secondary,
  },
});
