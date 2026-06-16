import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { FontSizes, Radius, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';
import type { AnalysisErrorCode } from '@/lib/types';

const COPY: Record<AnalysisErrorCode, string> = {
  empty: 'Paste a message first.',
  over_limit: "That's a bit long. Trim it to 2,000 characters.",
  network: "Couldn't analyze that. Check your connection and try again.",
  timeout: "Couldn't analyze that. Check your connection and try again.",
  rate_limit: 'The analysis service is busy right now. Try again in a moment.',
  service: 'Something went wrong on the analysis side. Try again in a moment.',
  parse: 'Something went wrong on the analysis side. Try again in a moment.',
  blocked: "This message was blocked by the safety filter and couldn't be analyzed.",
};

export function ErrorState({
  code,
  onRetry,
}: {
  code: AnalysisErrorCode;
  onRetry?: () => void;
}) {
  const c = usePalette();
  return (
    <View
      style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}
      accessibilityRole="text">
      <View style={styles.row}>
        <IconSymbol name="exclamationmark.triangle.fill" size={20} color={c.riskSuspicious} />
        <Text style={[styles.text, { color: c.text }]}>{COPY[code]}</Text>
      </View>
      {onRetry && code !== 'over_limit' && code !== 'blocked' && (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Try again"
          style={[styles.retry, { borderColor: c.accent }]}>
          <Text style={[styles.retryText, { color: c.accent }]}>Try again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  text: { fontSize: FontSizes.body, flexShrink: 1, lineHeight: 22 },
  retry: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  retryText: { fontSize: FontSizes.label, fontWeight: '600' },
});
