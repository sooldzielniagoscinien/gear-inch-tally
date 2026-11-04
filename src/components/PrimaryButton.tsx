import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { usePressScale } from '../hooks/usePressScale';
import { theme } from '../constants/theme';

export type IconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

const ICON_SIZE = 24;
const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconComponent;
  colors?: string[];
  height?: number;
  textColor?: string;
};

export function PrimaryButton({
  label,
  onPress,
  Icon,
  colors = theme.gradients.primary,
  height = 60,
  textColor = theme.colors.text.onAccent,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SLOP}
      style={[styles.press, { height }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.fill, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.grad, { height }]}>
          <View style={styles.row}>
            {Icon ? <Icon size={ICON_SIZE} strokeWidth={2} color={textColor} /> : null}
            <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    borderRadius: 18,
    ...theme.shadows.primary,
  },
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  grad: {
    width: '100%',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
    lineHeight: ICON_SIZE,
  },
});
