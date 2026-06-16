import { StyleSheet, Text } from 'react-native';

import { FontSizes, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';

const TEXT =
  'This is an AI explanation and can be wrong. For anything important, contact the company directly using a number you trust, not one in the message.';

export function Disclaimer() {
  const c = usePalette();
  return (
    <Text style={[styles.text, { color: c.textMuted }]} accessibilityRole="text">
      {TEXT}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: FontSizes.label,
    lineHeight: 19,
    marginTop: Spacing.md,
  },
});
