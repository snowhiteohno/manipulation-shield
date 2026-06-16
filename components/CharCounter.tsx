import { StyleSheet, Text } from 'react-native';

import { FontSizes } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';

export function CharCounter({ count, max }: { count: number; max: number }) {
  const c = usePalette();
  const over = count > max;
  return (
    <Text
      style={[styles.text, { color: over ? c.riskHigh : c.textMuted }]}
      accessibilityLabel={`${count} of ${max} characters`}>
      {count} / {max}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: FontSizes.label,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
});
