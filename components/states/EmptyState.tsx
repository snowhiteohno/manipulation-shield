import { StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { FontSizes, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';

export function EmptyState() {
  const c = usePalette();
  return (
    <View style={styles.wrap} accessibilityRole="text">
      <IconSymbol name="shield.lefthalf.filled" size={40} color={c.border} />
      <Text style={[styles.text, { color: c.textMuted }]}>
        Paste a message to see what it&apos;s really doing.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xxl,
  },
  text: { fontSize: FontSizes.body, textAlign: 'center' },
});
