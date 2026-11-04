import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  text: string;
  width: number;
};

/** Row expander. Only opacity is animated — height stays fixed. */
export const DetailChip = memo(function DetailChip({ text, width }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: theme.animation.fadeFast,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.chip, { width, opacity }]} pointerEvents="none">
      <Text style={styles.text} numberOfLines={2}>
        {text}
      </Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  chip: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,159,28,0.09)',
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.accent.secondary,
  },
  text: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    lineHeight: 15,
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
});
