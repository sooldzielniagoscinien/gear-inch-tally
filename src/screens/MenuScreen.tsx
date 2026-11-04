import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Calculator, Info, Library } from 'lucide-react-native';
import { assets } from '../assets';
import { BikeRow } from '../components/BikeRow';
import { ChainDivider } from '../components/ChainDivider';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatCard } from '../components/StatCard';
import {
  BIKES,
  DEFAULT_CADENCE,
  DEFAULT_CRANK_MM,
  RIMS,
  SCREEN_W,
} from '../constants/config';
import { theme } from '../constants/theme';
import { rangePercent } from '../game/compare';
import { buildGearRows } from '../game/gearMath';
import { usePressScale } from '../hooks/usePressScale';
import { fmtPct } from '../utils/format';

const CONTENT_W = SCREEN_W - 36;
const GAP = 12;
const PLAY_W = Math.round((CONTENT_W - GAP) * 0.6);
const RIGHT_W = CONTENT_W - GAP - PLAY_W;
const FOOT_W = Math.floor((CONTENT_W - GAP) / 2);
const PLAY_H = 196;
const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

const BIKE_SPRITES = [assets.sprite1, assets.sprite2];

type Props = {
  onPlay: (bikeIndex: number) => void;
};

function bikeRange(index: number): number {
  const bike = BIKES[index];
  const rows = buildGearRows({
    ring: bike.ring,
    cogs: bike.cogs,
    bsd: RIMS[bike.rimIdx].bsd,
    tyre: bike.tyre,
    crank: DEFAULT_CRANK_MM,
    cadence: DEFAULT_CADENCE,
  });
  return rangePercent(rows.map(r => r.gearInches));
}

export function MenuScreen({ onPlay }: Props) {
  const play = usePressScale(0.96);
  const badgePulse = useRef(new Animated.Value(1)).current;
  const stagger = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;

  const ranges = useMemo(() => BIKES.map((_unused, i) => bikeRange(i)), []);
  const bestRange = useMemo(() => Math.max(...ranges), [ranges]);
  const totalGears = useMemo(
    () => BIKES.reduce((sum, bike) => sum + bike.cogs.length, 0),
    [],
  );

  useEffect(() => {
    Animated.stagger(
      70,
      stagger.map(v =>
        Animated.timing(v, { toValue: 1, duration: 260, useNativeDriver: true }),
      ),
    ).start();

    Animated.sequence([
      Animated.delay(320),
      Animated.spring(badgePulse, {
        toValue: 1.06,
        tension: 220,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(badgePulse, {
        toValue: 1,
        tension: 220,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [stagger, badgePulse]);

  const handlePlay = useCallback(() => onPlay(0), [onPlay]);
  const handleBike = useCallback((index: number) => onPlay(index), [onPlay]);

  const rise = useCallback(
    (i: number) => ({
      opacity: stagger[i],
      transform: [
        {
          translateY: stagger[i].interpolate({
            inputRange: [0, 1],
            outputRange: [14, 0],
          }),
        },
      ],
    }),
    [stagger],
  );

  return (
    <ScreenBackground variant="menu">
      <ScreenHeader
        title="BIKE GARAGE"
        leftSlot={
          <View style={styles.homePlate}>
            <Image source={assets.iconHome} style={styles.homeIcon} resizeMode="contain" />
          </View>
        }
        rightSlot={
          <Animated.View style={[styles.badge, { transform: [{ scale: badgePulse }] }]}>
            <Text style={styles.badgeText}>{totalGears} GEARS</Text>
          </Animated.View>
        }
      />

      <View style={styles.body}>
        <Animated.View style={[styles.topRow, rise(0)]} pointerEvents="box-none">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="START GEAR CALC"
            onPress={handlePlay}
            onPressIn={play.onPressIn}
            onPressOut={play.onPressOut}
            hitSlop={HIT_SLOP}
            style={[styles.playPress, { width: PLAY_W, height: PLAY_H }]}>
            <Animated.View
              pointerEvents="box-none"
              style={[
                styles.playFill,
                { width: PLAY_W, height: PLAY_H, transform: [{ scale: play.scale }] },
              ]}>
              <LinearGradient
                colors={theme.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.playGrad, { width: PLAY_W, height: PLAY_H }]}>
                <View style={styles.playIconWrap}>
                  <Calculator size={30} strokeWidth={2} color={theme.colors.text.onAccent} />
                </View>
                <View style={styles.playTextBlock}>
                  <Text style={styles.playTitle}>START GEAR CALC</Text>
                  <Text style={styles.playCaption}>ENTER CHAINRINGS AND COGS</Text>
                </View>
              </LinearGradient>
            </Animated.View>
          </Pressable>

          <View style={[styles.rightCol, { width: RIGHT_W }]}>
            <StatCard
              value={String(BIKES.length)}
              label="SAVED BIKES"
              accent={theme.colors.accent.primary}
              height={92}
            />
            <StatCard
              value={fmtPct(bestRange)}
              label="BEST RANGE"
              accent={theme.colors.accent.secondary}
              height={92}
            />
          </View>
        </Animated.View>

        <ChainDivider links={5} marginTop={12} marginBottom={12} />

        <Animated.View style={[styles.bikeList, rise(1)]} pointerEvents="box-none">
          {BIKES.map((bike, i) => (
            <BikeRow
              key={bike.id}
              index={i}
              name={bike.name}
              spec={bike.spec}
              rangePct={ranges[i]}
              sprite={BIKE_SPRITES[i] ?? assets.sprite1}
              onPress={handleBike}
            />
          ))}
        </Animated.View>

        <View style={styles.spacer} />

        <Animated.View style={rise(2)} pointerEvents="box-none">
          <Text style={styles.hint}>TAP A BIKE TO LOAD ITS DRIVETRAIN</Text>
        </Animated.View>

        <Animated.View style={[styles.footer, rise(3)]} pointerEvents="box-none">
          <View style={styles.footSlot}>
            <SecondaryButton label="PRESETS" Icon={Library} onPress={handlePlay} />
          </View>
          <View style={styles.footSlot}>
            <SecondaryButton label="GEAR MATH" Icon={Info} onPress={handlePlay} />
          </View>
        </Animated.View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
  },
  homePlate: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(46,196,182,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(46,196,182,0.30)',
  },
  homeIcon: {
    width: 24,
    height: 24,
  },
  badge: {
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(46,196,182,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(46,196,182,0.38)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.accent.primary,
    fontVariant: ['tabular-nums'],
  },
  topRow: {
    flexDirection: 'row',
    gap: GAP,
    height: PLAY_H,
  },
  playPress: {
    borderRadius: 20,
    shadowColor: theme.colors.accent.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 18,
    elevation: 9,
  },
  playFill: {
    borderRadius: 20,
  },
  playGrad: {
    borderRadius: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
  },
  playIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6,35,31,0.14)',
  },
  playTextBlock: {
    width: '100%',
  },
  playTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.text.onAccent,
  },
  playCaption: {
    marginTop: 6,
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: 'rgba(6,35,31,0.68)',
  },
  rightCol: {
    gap: GAP,
  },
  bikeList: {
    gap: 10,
  },
  spacer: {
    flexGrow: 1,
    minHeight: 10,
  },
  hint: {
    marginBottom: 8,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
  footer: {
    flexDirection: 'row',
    gap: GAP,
  },
  footSlot: {
    width: FOOT_W,
  },
});
