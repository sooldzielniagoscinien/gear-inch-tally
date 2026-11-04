import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Home, RefreshCw, Repeat } from 'lucide-react-native';
import { assets } from '../assets';
import { ChainDivider } from '../components/ChainDivider';
import { ExportPreview } from '../components/ExportPreview';
import { OverlayCompare } from '../components/OverlayCompare';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatCard } from '../components/StatCard';
import { COMPACT, SCREEN_W } from '../constants/config';
import { theme } from '../constants/theme';
import { CompareSummary } from '../game/compare';
import { fmtPct } from '../utils/format';

const CONTENT_W = SCREEN_W - 36;
const BAR_W = CONTENT_W - 32;
const GAP = 10;
const STAT_H = COMPACT ? 64 : 70;
const CTA_H = COMPACT ? 54 : 60;
const HERO_SIZE = COMPACT ? 23 : 26;

type Props = {
  summary: CompareSummary;
  onPlayAgain: () => void;
  onMenu: () => void;
};

export function GameOverScreen({ summary, onPlayAgain, onMenu }: Props) {
  const [swapped, setSwapped] = useState(false);
  const enter = useRef(new Animated.Value(0)).current;

  const first = swapped ? summary.b : summary.a;
  const second = swapped ? summary.a : summary.b;

  // Only pills that carry a value are rendered — never an empty box.
  const stats = useMemo(() => {
    const list = [
      {
        key: 'range-a',
        value: fmtPct(first.rangePct),
        label: 'RANGE ' + first.label.slice(-1),
        accent: theme.colors.accent.primary,
      },
      {
        key: 'range-b',
        value: fmtPct(second.rangePct),
        label: 'RANGE ' + second.label.slice(-1),
        accent: theme.colors.accent.secondary,
      },
    ];
    if (summary.duplicates > 0) {
      list.push({
        key: 'dupes',
        value: String(summary.duplicates),
        label: 'DUPLICATES',
        accent: theme.colors.text.primary,
      });
    }
    return list;
  }, [first, second, summary.duplicates]);

  const slotW = Math.floor((CONTENT_W - GAP * (stats.length - 1)) / stats.length);

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [enter]);

  const handleSwap = useCallback(() => {
    setSwapped(prev => !prev);
  }, []);

  const riseStyle = {
    opacity: enter,
    transform: [
      {
        translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
      },
    ],
  };

  return (
    <ScreenBackground variant="result">
      <ScreenHeader
        title="COMPARE SUMMARY"
        subtitle={first.spec}
        leftSlot={
          <View style={styles.logoPlate}>
            <Image source={assets.logo} style={styles.logoIcon} resizeMode="contain" />
          </View>
        }
        rightSlot={
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{summary.duplicates} DUPES</Text>
          </View>
        }
      />

      <Animated.View style={[styles.body, riseStyle]} pointerEvents="box-none">
        <Text style={styles.hero}>RANGE COMPARED</Text>
        <ChainDivider links={7} marginTop={10} marginBottom={12} />

        <OverlayCompare
          a={first}
          b={second}
          min={summary.min}
          max={summary.max}
          duplicatePositions={summary.duplicatePositions}
          barWidth={BAR_W}
        />

        <View style={styles.statRow}>
          {stats.map(stat => (
            <View key={stat.key} style={{ width: slotW }}>
              <StatCard
                value={stat.value}
                label={stat.label}
                accent={stat.accent}
                height={STAT_H}
              />
            </View>
          ))}
        </View>

        <View style={styles.exportBlock}>
          <ExportPreview lines={summary.exportLines} />
          <View style={styles.copyWrap}>
            <SecondaryButton
              label="SWAP A AND B"
              Icon={Repeat}
              onPress={handleSwap}
              height={46}
              tint={swapped ? theme.colors.accent.primary : theme.colors.text.primary}
            />
          </View>
        </View>

        <View style={styles.spacer} />

        <Text style={styles.hint}>RERUN THE MATH WITH A DIFFERENT CASSETTE</Text>
        <PrimaryButton
          label="COMPARE AGAIN"
          Icon={RefreshCw}
          onPress={onPlayAgain}
          height={CTA_H}
        />
        <View style={styles.menuWrap}>
          <SecondaryButton label="GARAGE" Icon={Home} onPress={onMenu} height={46} />
        </View>
      </Animated.View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: COMPACT ? 10 : 16,
    paddingBottom: COMPACT ? 12 : 18,
  },
  logoPlate: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(46,196,182,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(46,196,182,0.30)',
  },
  logoIcon: {
    width: 26,
    height: 26,
  },
  badge: {
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,159,28,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,159,28,0.38)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.accent.secondary,
    fontVariant: ['tabular-nums'],
  },
  hero: {
    fontSize: HERO_SIZE,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    color: theme.colors.text.primary,
    textShadowColor: 'rgba(46,196,182,0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  statRow: {
    flexDirection: 'row',
    gap: GAP,
    marginTop: 12,
  },
  exportBlock: {
    marginTop: 12,
    gap: 10,
  },
  copyWrap: {
    width: '100%',
  },
  spacer: {
    flexGrow: 1,
    minHeight: 10,
  },
  hint: {
    marginBottom: 8,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
  menuWrap: {
    width: '100%',
    marginTop: 10,
  },
});
