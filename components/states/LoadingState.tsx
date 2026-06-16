import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { FontSizes, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';

export function LoadingState() {
  const c = usePalette();
  return (
    <View style={styles.wrap} accessibilityRole="text" accessibilityLabel="Reading the message">
      <ActivityIndicator color={c.accent} />
      <Text style={[styles.text, { color: c.textMuted }]}>
        Looking for the technique behind this message.
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
