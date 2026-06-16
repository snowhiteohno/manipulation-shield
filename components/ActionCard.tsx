import { StyleSheet, Text, View } from 'react-native';

import { FontSizes, Radius, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';
import { RISK_META } from '@/lib/risk';
import type { RiskLevel } from '@/lib/types';

// The most important block on the result screen: one clear next step.
export function ActionCard({ action, level }: { action: string; level: RiskLevel }) {
  const c = usePalette();
  const color = c[RISK_META[level].colorKey];

  return (
    <View
      style={[styles.card, { backgroundColor: c.surface, borderColor: color, borderLeftColor: color }]}
      accessibilityRole="text"
      accessibilityLabel={`Recommended action: ${action}`}>
      <Text style={[styles.label, { color }]}>RECOMMENDED ACTION</Text>
      <Text style={[styles.action, { color: c.text }]}>{action}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderWidth: 1,
    borderLeftWidth: 5,
    padding: Spacing.lg,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  action: { fontSize: FontSizes.body, fontWeight: '500', lineHeight: 24 },
});
