import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FontSizes, Radius, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';
import { segmentMessage } from '@/lib/highlight';
import type { FlaggedPhrase } from '@/lib/types';

export function HighlightedMessage({
  message,
  flaggedPhrases,
}: {
  message: string;
  flaggedPhrases: FlaggedPhrase[];
}) {
  const c = usePalette();
  const [selected, setSelected] = useState<{ phrase: string; reason: string } | null>(null);
  const segments = segmentMessage(message, flaggedPhrases);
  const highlightBg = c.riskSuspicious + '33';

  return (
    <View
      style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
      <Text style={[styles.body, { color: c.text }]} accessibilityLabel="The message, annotated">
        {segments.map((s) =>
          s.reason ? (
            <Text
              key={s.key}
              onPress={() => setSelected({ phrase: s.text, reason: s.reason! })}
              style={[styles.highlight, { backgroundColor: highlightBg, color: c.text }]}
              accessibilityRole="button"
              accessibilityLabel={`Flagged phrase: ${s.text}. ${s.reason}`}>
              {s.text}
            </Text>
          ) : (
            <Text key={s.key}>{s.text}</Text>
          ),
        )}
      </Text>

      {selected && (
        <View style={[styles.reasonBox, { backgroundColor: c.background, borderColor: c.border }]}>
          <Text style={[styles.reasonPhrase, { color: c.riskSuspicious }]}>
            &ldquo;{selected.phrase}&rdquo;
          </Text>
          <Text style={[styles.reasonText, { color: c.textMuted }]}>{selected.reason}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  body: { fontSize: FontSizes.body, lineHeight: 25 },
  highlight: { fontWeight: '600', borderRadius: 4 },
  reasonBox: {
    marginTop: Spacing.md,
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: Spacing.md,
  },
  reasonPhrase: { fontSize: FontSizes.label, fontWeight: '700', marginBottom: 4 },
  reasonText: { fontSize: FontSizes.label, lineHeight: 19 },
});
