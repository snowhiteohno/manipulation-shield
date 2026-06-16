import { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { FontSizes, Radius, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';
import type { Tactic } from '@/lib/types';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function TacticListItem({
  tactic,
  initiallyExpanded = false,
}: {
  tactic: Tactic;
  initiallyExpanded?: boolean;
}) {
  const c = usePalette();
  const [expanded, setExpanded] = useState(initiallyExpanded);

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((e) => !e);
  }

  return (
    <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${tactic.name}. ${tactic.summary}`}
        style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.name, { color: c.text }]}>{tactic.name}</Text>
          <Text style={[styles.summary, { color: c.textMuted }]}>{tactic.summary}</Text>
        </View>
        <IconSymbol
          name={expanded ? 'chevron.up' : 'chevron.down'}
          size={20}
          color={c.textMuted}
        />
      </Pressable>

      {expanded && (
        <View style={styles.body}>
          <Text style={[styles.explanation, { color: c.text }]}>{tactic.explanation}</Text>
          <Text style={[styles.label, { color: c.textMuted }]}>EXAMPLE</Text>
          <View style={[styles.example, { backgroundColor: c.background, borderColor: c.border }]}>
            <Text style={[styles.exampleText, { color: c.text }]}>{tactic.example}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    minHeight: 44,
  },
  headerText: { flex: 1, gap: 2 },
  name: { fontSize: FontSizes.heading, fontWeight: '600' },
  summary: { fontSize: FontSizes.label, lineHeight: 18 },
  body: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  explanation: { fontSize: FontSizes.body, lineHeight: 24 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: Spacing.sm,
  },
  example: {
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: Spacing.md,
  },
  exampleText: { fontSize: FontSizes.label, lineHeight: 20, fontStyle: 'italic' },
});
