import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HEADER_CONTENT_H, HEADER_TOP_PAD } from '../constants/config';
import { theme } from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string | null;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
};

/**
 * One header for every screen. Only the slots change — never duplicate this
 * markup inline, the styling drifts apart across screens.
 */
export function ScreenHeader({ title, subtitle, leftSlot, rightSlot }: Props) {
  return (
    <View style={styles.header}>
      {leftSlot ? <View style={styles.left}>{leftSlot}</View> : null}
      <View style={styles.titleBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightSlot ? <View style={styles.right}>{rightSlot}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: HEADER_TOP_PAD,
    height: HEADER_TOP_PAD + HEADER_CONTENT_H,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.ui.overlay,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.border,
  },
  left: {
    marginRight: 12,
  },
  titleBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.text.primary,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  right: {
    marginLeft: 12,
  },
});
