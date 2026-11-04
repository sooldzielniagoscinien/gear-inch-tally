import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  value: string;
  label: string;
  accent: string;
  height?: number;
  compact?: boolean;
};

/**
 * The single stat-card used on Menu, the Game stat strip and the result screen.
 * No raster icons: an 8x8 accent dot carries the semantics, so every pill in a
 * row is exactly the same shape.
 */
export function StatCard({ value, label, accent, height = 92, compact = false }: Props) {
  return (
    <View
      style={[
        styles.card,
        compact ? styles.cardCompact : styles.cardFull,
        { height, borderColor: accent + '55' },
      ]}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text
        style={[compact ? styles.valueCompact : styles.value, { color: accent }]}
        numberOfLines={1}>
        {value}
      </Text>
      <Text style={compact ? styles.labelCompact : styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // width:'100%' — never flex:1 inside an already flex:1 slot.
  card: {
    width: '100%',
    backgroundColor: theme.colors.ui.glass,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 12,
  },
  cardFull: {
    paddingTop: 22,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cardCompact: {
    paddingTop: 6,
    paddingBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    top: 10,
    left: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.4,
    lineHeight: 26,
    fontVariant: ['tabular-nums'],
  },
  valueCompact: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
    lineHeight: 20,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
  },
  labelCompact: {
    marginTop: 1,
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.9,
    color: theme.colors.text.secondary,
  },
});
