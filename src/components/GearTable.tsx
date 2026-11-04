import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
import { BOARD_PAD, BOARD_W, COL_W } from '../constants/config';
import { theme } from '../constants/theme';
import { GearRowData } from '../game/gearMath';
import { fmt1, fmt2, fmtSpeed } from '../utils/format';
import { GearRow } from './GearRow';

const COLUMNS = ['COG', 'GEAR IN', 'DEV m', 'GAIN'];

export type GearDisplayRow = {
  key: string;
  index: number;
  cog: number;
  gearInches: string;
  development: string;
  gain: string;
  detail: string;
};

type Props = {
  rows: GearRowData[];
  metric: boolean;
  cadence: number;
  selectedIndex: number;
  onSelectRow: (index: number) => void;
};

function keyExtractor(item: GearDisplayRow) {
  return item.key;
}

export function GearTable({ rows, metric, cadence, selectedIndex, onSelectRow }: Props) {
  const fade = useRef(new Animated.Value(1)).current;

  const data: GearDisplayRow[] = useMemo(
    () =>
      rows.map((r, i) => ({
        key: 'cog-' + r.cog,
        index: i,
        cog: r.cog,
        gearInches: fmt1(r.gearInches),
        development: fmt2(r.development),
        gain: fmt2(r.gain),
        detail:
          'RATIO ' +
          fmt2(r.ratio) +
          '  ·  SKID PATCHES ' +
          r.skidPatches +
          '  ·  ' +
          cadence +
          ' rpm = ' +
          fmtSpeed(r.speedKmh, metric),
      })),
    [rows, metric, cadence],
  );

  // Values cross-fade whenever the drivetrain changes.
  useEffect(() => {
    fade.setValue(0.35);
    Animated.timing(fade, {
      toValue: 1,
      duration: theme.animation.fadeFast,
      useNativeDriver: true,
    }).start();
  }, [fade, data]);

  const renderItem = useMemo(
    () =>
      function render({ item }: ListRenderItemInfo<GearDisplayRow>) {
        return (
          <GearRow
            index={item.index}
            cog={item.cog}
            gearInches={item.gearInches}
            development={item.development}
            gain={item.gain}
            detail={item.detail}
            colW={COL_W}
            selected={item.index === selectedIndex}
            odd={item.index % 2 === 1}
            onSelect={onSelectRow}
          />
        );
      },
    [selectedIndex, onSelectRow],
  );

  return (
    <View style={[styles.board, { width: BOARD_W }]}>
      <View style={[styles.headerRow, { width: COL_W * 4 }]}>
        {COLUMNS.map(c => (
          <Text key={c} style={[styles.headerCell, { width: COL_W }]} numberOfLines={1}>
            {c}
          </Text>
        ))}
      </View>
      <Animated.View style={[styles.listWrap, { opacity: fade }]} pointerEvents="box-none">
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          windowSize={5}
          removeClippedSubviews={false}
          contentContainerStyle={styles.listContent}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    flex: 1,
    minHeight: 140,
    alignSelf: 'center',
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingHorizontal: BOARD_PAD,
  },
  headerRow: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46,196,182,0.10)',
  },
  headerCell: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.accent.primary,
    textAlign: 'center',
  },
  listWrap: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 8,
  },
});
