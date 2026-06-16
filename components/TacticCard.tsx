import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { FontSizes, Radius, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';
import type { TacticHit } from '@/lib/types';

export function TacticCard({
  tactic,
  onPress,
}: {
  tactic: TacticHit;
  onPress?: () => void;
}) {
  const c = usePalette();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`Tactic: ${tactic.name}`}
      style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: c.text }]}>{tactic.name}</Text>
        {onPress && <IconSymbol name="chevron.right" size={18} color={c.textMuted} />}
      </View>

      <Text style={[styles.label, { color: c.textMuted }]}>WHAT IT&apos;S DOING</Text>
      <Text style={[styles.body, { color: c.text }]}>{tactic.whatItsDoing}</Text>

      <Text style={[styles.label, { color: c.textMuted }]}>WHY IT WORKS</Text>
      <Text style={[styles.body, { color: c.text }]}>{tactic.whyItWorks}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  name: { fontSize: FontSizes.heading, fontWeight: '600', flexShrink: 1 },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    marginTop: Spacing.md,
    marginBottom: 4,
  },
  body: { fontSize: FontSizes.body, lineHeight: 23 },
});
