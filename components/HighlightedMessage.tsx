import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FontSizes, Radius, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';
import type { FlaggedPhrase } from '@/lib/types';

type Segment = { text: string; reason?: string; key: string };

// Build non-overlapping segments: plain runs and highlighted runs. Matching is
// case-insensitive and handles multiple occurrences; phrases not found verbatim
// are skipped rather than crashing (ARCHITECTURE §7).
function segment(message: string, phrases: FlaggedPhrase[]): Segment[] {
  const lower = message.toLowerCase();
  const ranges: { start: number; end: number; reason: string }[] = [];

  for (const { phrase, reason } of phrases) {
    if (!phrase) continue;
    const needle = phrase.toLowerCase();
    let from = 0;
    let idx = lower.indexOf(needle, from);
    while (idx !== -1) {
      ranges.push({ start: idx, end: idx + phrase.length, reason });
      from = idx + phrase.length;
      idx = lower.indexOf(needle, from);
    }
  }

  // Sort and drop overlaps (keep the earliest-starting range).
  ranges.sort((a, b) => a.start - b.start);
  const kept: typeof ranges = [];
  let cursor = 0;
  for (const r of ranges) {
    if (r.start >= cursor) {
      kept.push(r);
      cursor = r.end;
    }
  }

  const segments: Segment[] = [];
  let pos = 0;
  kept.forEach((r, i) => {
    if (r.start > pos) {
      segments.push({ text: message.slice(pos, r.start), key: `p${pos}` });
    }
    segments.push({ text: message.slice(r.start, r.end), reason: r.reason, key: `h${i}` });
    pos = r.end;
  });
  if (pos < message.length) {
    segments.push({ text: message.slice(pos), key: `p${pos}` });
  }
  return segments;
}

export function HighlightedMessage({
  message,
  flaggedPhrases,
}: {
  message: string;
  flaggedPhrases: FlaggedPhrase[];
}) {
  const c = usePalette();
  const [selected, setSelected] = useState<{ phrase: string; reason: string } | null>(null);
  const segments = segment(message, flaggedPhrases);
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
