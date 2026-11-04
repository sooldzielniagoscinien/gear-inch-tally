import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { ChainDivider } from '../components/ChainDivider';
import { ScreenBackground } from '../components/ScreenBackground';
import { LOADER_DURATION_MS } from '../constants/config';
import { theme } from '../constants/theme';

const BAR_W = 212;

type Props = {
  onDone: () => void;
};

export function LoaderScreen({ onDone }: Props) {
  const mark = useRef(new Animated.Value(0)).current;
  const grow = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.45)).current;
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(mark, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(grow, {
        toValue: 1,
        duration: LOADER_DURATION_MS,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();

    const timer = setTimeout(() => done.current(), LOADER_DURATION_MS);
    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, [mark, grow, pulse]);

  const markScale = mark.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] });

  return (
    <ScreenBackground variant="loader">
      <View style={styles.root}>
        <Animated.View
          pointerEvents="none"
          style={[styles.plate, { opacity: mark, transform: [{ scale: markScale }] }]}>
          <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <Animated.View pointerEvents="none" style={{ opacity: mark }}>
          <Text style={styles.brandTop}>GEAR INCH</Text>
          <Text style={styles.brandBottom}>TALLY</Text>
        </Animated.View>

        <View style={styles.dividerWrap}>
          <ChainDivider links={9} />
        </View>

        <Text style={styles.subtitle}>DRIVETRAIN MATH - OFFLINE</Text>

        <View style={styles.barTrack}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.barFill,
              {
                transform: [
                  { translateX: -BAR_W / 2 },
                  { scaleX: grow },
                  { translateX: BAR_W / 2 },
                ],
              },
            ]}>
            <LinearGradient
              colors={theme.gradients.range}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.barGrad}
            />
          </Animated.View>
        </View>

        <Animated.Text style={[styles.status, { opacity: pulse }]}>
          LOADING GEAR TABLES
        </Animated.Text>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  plate: {
    width: 180,
    height: 180,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(46,196,182,0.22)',
    marginBottom: 28,
  },
  logo: {
    width: 148,
    height: 148,
  },
  brandTop: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
    color: theme.colors.text.primary,
    textShadowColor: 'rgba(46,196,182,0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  brandBottom: {
    marginTop: 2,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 8,
    textAlign: 'center',
    color: theme.colors.accent.primary,
    textShadowColor: 'rgba(46,196,182,0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  dividerWrap: {
    width: 212,
    marginTop: 18,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2.4,
    color: theme.colors.text.secondary,
  },
  barTrack: {
    width: BAR_W,
    height: 5,
    borderRadius: 3,
    marginTop: 34,
    backgroundColor: 'rgba(237,242,244,0.10)',
    overflow: 'hidden',
  },
  barFill: {
    width: BAR_W,
    height: 5,
    borderRadius: 3,
  },
  barGrad: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
  },
  status: {
    marginTop: 16,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
});
