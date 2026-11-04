import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  links?: number;
  marginTop?: number;
  marginBottom?: number;
};

/** The signature chain-link divider used between sections. */
export function ChainDivider({ links = 5, marginTop = 0, marginBottom = 0 }: Props) {
  const items: number[] = [];
  for (let i = 0; i < links; i++) {
    items.push(i);
  }

  return (
    <View style={[styles.wrap, { marginTop, marginBottom }]} pointerEvents="none">
      <View style={styles.line} />
      <View style={styles.links}>
        {items.map(i => (
          <View key={i} style={styles.link} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.ui.divider,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
  },
  link: {
    width: 6,
    height: 6,
    borderRadius: 2,
    backgroundColor: 'rgba(237,242,244,0.22)',
  },
});
