import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  lines: string[];
};

/** The shareable plain-text table preview. */
export function ExportPreview({ lines }: Props) {
  if (!lines.length) {
    return null;
  }

  return (
    <View style={styles.well}>
      {lines.map((line, i) => (
        <Text
          key={'line-' + i}
          style={[styles.line, i === 0 ? styles.head : null]}
          numberOfLines={1}>
          {line}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  well: {
    height: 76,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: theme.colors.ui.well,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  line: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  head: {
    fontWeight: '800',
    color: theme.colors.accent.primary,
    letterSpacing: 0.8,
  },
});
