import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** The glass bento surface shared by Menu, Game and the result screen. */
export function BentoTile({ children, style }: Props) {
  return <View style={[styles.tile, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: theme.colors.ui.glass,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
  },
});
