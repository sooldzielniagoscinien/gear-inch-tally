import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ChevronLeft, GitCompare } from 'lucide-react-native';
import { assets } from '../assets';
import { CadenceChip } from '../components/CadenceChip';
import { GearTable } from '../components/GearTable';
import { PrimaryButton } from '../components/PrimaryButton';
import { RangeBar } from '../components/RangeBar';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatCard } from '../components/StatCard';
import { TeethChip } from '../components/TeethChip';
import {
  BIKES,
  CADENCES,
  CHAINRINGS,
  COG_CHOICES,
  COMPACT,
  DEFAULT_CADENCE,
  DEFAULT_CRANK_MM,
  RIMS,
  SCREEN_W,
} from '../constants/config';
import { theme } from '../constants/theme';
import { buildSummary, CompareSummary } from '../game/compare';
import { useDrivetrain } from '../hooks/useDrivetrain';
import { usePressScale } from '../hooks/usePressScale';
import { fmt1, fmtPct, speedUnit } from '../utils/format';

const CONTENT_W = SCREEN_W - 32;
const CHIP_GAP = 10;
const CADENCE_W = Math.floor((CONTENT_W - CHIP_GAP * 3) / 4);
const SELECTOR_W = Math.floor((CONTENT_W - CHIP_GAP) / 2);
const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

// Responsive sizing: short devices get tighter chips and paddings so the
// controls panel and the CTA always stay on screen.
const CHIP_SIZE = COMPACT ? 48 : 56;
const SECTION_GAP = COMPACT ? 8 : 12;
const SECTION_TOP = COMPACT ? 6 : 8;
const STAT_H = COMPACT ? 40 : 44;
const CTA_H = COMPACT ? 54 : 60;
const CONTROLS_PT = COMPACT ? 10 : 14;
const CONTROLS_PB = COMPACT ? 12 : 18;
const AREA_PT = COMPACT ? 8 : 12;

type Props = {
  bikeIndex: number;
  onBack: () => void;
  onGameOver: (summary: CompareSummary) => void;
};

function cogKey(value: number) {
  return 'cog-' + value;
}

export function GameScreen({ bikeIndex, onBack, onGameOver }: Props) {
  const dt = useDrivetrain(bikeIndex);
  const [selectedRow, setSelectedRow] = useState<number>(-1);
  const back = usePressScale(0.92);
  const settings = usePressScale(0.92);

  // Read inside the compare callback without re-creating it on every keystroke.
  const latest = useRef(dt);
  latest.current = dt;

  const handleSelectRow = useCallback((index: number) => {
    setSelectedRow(prev => (prev === index ? -1 : index));
  }, []);

  const handleCompare = useCallback(() => {
    const current = latest.current;
    const other = BIKES[(bikeIndex + 1) % BIKES.length];
    const summary = buildSummary(
      current.input,
      'DRIVETRAIN A',
      current.fullSpec,
      {
        ring: other.ring,
        cogs: other.cogs,
        bsd: RIMS[other.rimIdx].bsd,
        tyre: other.tyre,
        crank: DEFAULT_CRANK_MM,
        cadence: DEFAULT_CADENCE,
      },
      'DRIVETRAIN B',
      other.spec,
    );
    onGameOver(summary);
  }, [bikeIndex, onGameOver]);

  const renderCog = useCallback(
    ({ item }: ListRenderItemInfo<number>) => (
      <TeethChip
        value={item}
        active={dt.cogs.includes(item)}
        onPress={dt.toggleCog}
        size={CHIP_SIZE}
        suffix="T"
      />
    ),
    [dt.cogs, dt.toggleCog],
  );

  const gears = useMemo(() => dt.rows.map(r => r.gearInches), [dt.rows]);
  const hasStats = dt.stats.low > 0 && dt.stats.high > 0 && dt.rows.length >= 2;

  return (
    <ScreenBackground variant="game">
      <ScreenHeader
        title="GEAR TABLE"
        subtitle={dt.spec}
        leftSlot={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to garage"
            onPress={onBack}
            onPressIn={back.onPressIn}
            onPressOut={back.onPressOut}
            hitSlop={HIT_SLOP}
            style={styles.navPress}>
            <Animated.View
              pointerEvents="box-none"
              style={[styles.navFill, { transform: [{ scale: back.scale }] }]}>
              <ChevronLeft size={22} strokeWidth={2} color={theme.colors.text.primary} />
            </Animated.View>
          </Pressable>
        }
        rightSlot={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Rider settings, toggle units"
            onPress={dt.toggleUnits}
            onPressIn={settings.onPressIn}
            onPressOut={settings.onPressOut}
            hitSlop={HIT_SLOP}
            style={styles.navPress}>
            <Animated.View
              pointerEvents="box-none"
              style={[styles.navFill, { transform: [{ scale: settings.scale }] }]}>
              <Image source={assets.iconPause} style={styles.navIcon} resizeMode="contain" />
            </Animated.View>
          </Pressable>
        }
      />

      <View style={styles.gameArea}>
        <View style={styles.labelRow}>
          <Image source={assets.sprite4} style={styles.labelSprite} resizeMode="contain" />
          <Text style={styles.label}>CHAINRING</Text>
          <Text style={styles.labelValue}>{dt.ring}T</Text>
        </View>
        <View style={styles.chipRow}>
          {CHAINRINGS.map(value => (
            <TeethChip
              key={'ring-' + value}
              value={value}
              active={dt.ring === value}
              onPress={dt.selectRing}
              size={CHIP_SIZE}
              suffix="T"
            />
          ))}
        </View>

        <View style={styles.labelRow}>
          <Image source={assets.sprite3} style={styles.labelSprite} resizeMode="contain" />
          <Text style={styles.label}>CASSETTE COGS</Text>
          <Text style={styles.labelValue}>{dt.cogs.length} COGS</Text>
        </View>
        <View style={styles.cogRail}>
          <FlatList
            data={COG_CHOICES}
            extraData={dt.cogs}
            horizontal
            keyExtractor={cogKey}
            renderItem={renderCog}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cogContent}
          />
        </View>

        {!COMPACT && hasStats ? (
          <View style={styles.rangeStrip}>
            <View style={styles.rangeHead}>
              <Text style={styles.label}>GEAR LADDER</Text>
              <Text style={styles.labelValue}>{speedUnit(dt.metric)}</Text>
            </View>
            <RangeBar
              width={CONTENT_W}
              gears={gears}
              min={dt.stats.low}
              max={dt.stats.high}
              color={theme.colors.accent.primary}
              height={8}
            />
          </View>
        ) : null}

        <GearTable
          rows={dt.rows}
          metric={dt.metric}
          cadence={dt.cadence}
          selectedIndex={selectedRow}
          onSelectRow={handleSelectRow}
        />

        {hasStats ? (
          <View style={styles.statStrip}>
            <View style={styles.statSlot}>
              <StatCard
                value={fmtPct(dt.stats.range)}
                label="RANGE"
                accent={theme.colors.accent.primary}
                height={STAT_H}
                compact
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard
                value={fmt1(dt.stats.low)}
                label="LOW GEAR"
                accent={theme.colors.accent.secondary}
                height={STAT_H}
                compact
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard
                value={fmt1(dt.stats.high)}
                label="HIGH GEAR"
                accent={theme.colors.text.primary}
                height={STAT_H}
                compact
              />
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.controls}>
        <View style={styles.labelRow}>
          <Image source={assets.sprite5} style={styles.labelSprite} resizeMode="contain" />
          <Text style={styles.label}>CADENCE</Text>
          <Text style={styles.labelValue}>
            {dt.cadence} RPM · {speedUnit(dt.metric)}
          </Text>
        </View>
        <View style={styles.cadenceRow}>
          {CADENCES.map(rpm => (
            <CadenceChip
              key={'rpm-' + rpm}
              rpm={rpm}
              active={dt.cadence === rpm}
              width={CADENCE_W}
              onPress={dt.selectCadence}
            />
          ))}
        </View>

        <View style={styles.selectorRow}>
          <View style={styles.selectorSlot}>
            <SecondaryButton
              label={'WHEEL ' + dt.rim.label}
              onPress={dt.cycleRim}
              height={44}
              tint={theme.colors.text.secondary}
            />
          </View>
          <View style={styles.selectorSlot}>
            <SecondaryButton
              label={'TYRE ' + dt.tyre + ' MM'}
              onPress={dt.cycleTyre}
              height={44}
              tint={theme.colors.text.secondary}
            />
          </View>
        </View>

        <Text style={styles.hint}>TAP A ROW FOR RATIO AND SPEED DETAIL</Text>
        <PrimaryButton
          label="COMPARE DRIVETRAINS"
          Icon={GitCompare}
          onPress={handleCompare}
          height={CTA_H}
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  navPress: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  navFill: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  navIcon: {
    width: 22,
    height: 22,
  },
  gameArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: AREA_PT,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 22,
  },
  labelSprite: {
    width: 20,
    height: 20,
  },
  label: {
    flex: 1,
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
  },
  labelValue: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.accent.primary,
    fontVariant: ['tabular-nums'],
  },
  chipRow: {
    flexDirection: 'row',
    gap: CHIP_GAP,
    marginTop: SECTION_TOP,
    marginBottom: SECTION_GAP,
  },
  cogRail: {
    height: CHIP_SIZE,
    marginTop: SECTION_TOP,
    marginBottom: SECTION_GAP,
  },
  cogContent: {
    gap: CHIP_GAP,
  },
  rangeStrip: {
    marginBottom: SECTION_GAP,
  },
  rangeHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statStrip: {
    flexDirection: 'row',
    gap: CHIP_GAP,
    marginTop: SECTION_GAP,
    marginBottom: SECTION_GAP,
  },
  statSlot: {
    flex: 1,
  },
  controls: {
    backgroundColor: theme.colors.bg.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.border,
    paddingHorizontal: 16,
    paddingTop: CONTROLS_PT,
    paddingBottom: CONTROLS_PB,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 14,
  },
  cadenceRow: {
    flexDirection: 'row',
    gap: CHIP_GAP,
    marginTop: SECTION_TOP,
  },
  selectorRow: {
    flexDirection: 'row',
    gap: CHIP_GAP,
    marginTop: 10,
  },
  selectorSlot: {
    width: SELECTOR_W,
  },
  hint: {
    marginTop: SECTION_GAP,
    marginBottom: 8,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
});
