import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { DetailChip } from './DetailChip';

const HIT_SLOP = { top: 4, bottom: 4, left: 8, right: 8 };
const ROW_H = 38;

type Props = {
  index: number;
  cog: number;
  gearInches: string;
  development: string;
  gain: string;
  detail: string;
  colW: number;
  selected: boolean;
  odd: boolean;
  onSelect: (index: number) => void;
};

export const GearRow = memo(function GearRow({
  index,
  cog,
  gearInches,
  development,
  gain,
  detail,
  colW,
  selected,
  odd,
  onSelect,
}: Props) {
  const handlePress = useCallback(() => onSelect(index), [onSelect, index]);
  const rowW = colW * 4;
  const valueStyle = selected ? styles.valueSelected : styles.value;

  return (
    <View style={{ width: rowW }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={cog + ' tooth cog, ' + gearInches + ' gear inches'}
        onPress={handlePress}
        hitSlop={HIT_SLOP}
        style={[
          styles.row,
          odd ? styles.rowAlt : null,
          selected ? styles.rowSelected : null,
          { width: rowW, height: ROW_H },
        ]}>
        {selected ? <View style={styles.marker} /> : null}
        <Text style={[styles.cog, { width: colW }, selected ? styles.cogSelected : null]}>
          {cog}T
        </Text>
        <Text style={[valueStyle, { width: colW }]}>{gearInches}</Text>
        <Text style={[valueStyle, { width: colW }]}>{development}</Text>
        <Text style={[valueStyle, { width: colW }]}>{gain}</Text>
      </Pressable>
      {selected ? <DetailChip text={detail} width={rowW} /> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowAlt: {
    backgroundColor: 'rgba(255,255,255,0.028)',
  },
  rowSelected: {
    backgroundColor: 'rgba(255,159,28,0.16)',
  },
  marker: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: theme.colors.accent.secondary,
  },
  cog: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  cogSelected: {
    color: theme.colors.accent.secondary,
    fontWeight: '800',
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  valueSelected: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.accent.secondary,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
});
