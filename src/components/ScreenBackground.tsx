import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { theme } from '../constants/theme';

export type BackgroundVariant = 'loader' | 'menu' | 'game' | 'result';

const OVERLAYS: Record<BackgroundVariant, string[]> = {
  loader: theme.gradients.loader,
  menu: theme.gradients.menu,
  game: theme.gradients.game,
  result: theme.gradients.result,
};

type Props = {
  variant: BackgroundVariant;
  children: React.ReactNode;
};

/** bg_game is the only background image; screens differ by overlay + decor. */
export function ScreenBackground({ variant, children }: Props) {
  return (
    <View style={styles.root}>
      <Image
        source={assets.bgGame}
        style={styles.image}
        resizeMode="cover"
        fadeDuration={0}
      />
      <LinearGradient
        colors={OVERLAYS[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.image}
        pointerEvents="none"
      />
      <View pointerEvents="none" style={[styles.blob, styles.blobTeal]} />
      <View pointerEvents="none" style={[styles.blob, styles.blobOrange]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.deep,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: undefined,
    height: undefined,
  },
  blob: {
    position: 'absolute',
    borderRadius: 400,
  },
  blobTeal: {
    width: 320,
    height: 320,
    top: -90,
    left: -110,
    backgroundColor: 'rgba(46,196,182,0.09)',
  },
  blobOrange: {
    width: 260,
    height: 260,
    bottom: -80,
    right: -90,
    backgroundColor: 'rgba(255,159,28,0.07)',
  },
  content: {
    flex: 1,
  },
});
