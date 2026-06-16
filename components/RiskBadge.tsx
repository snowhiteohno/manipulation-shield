import { StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { FontSizes, Radius, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';
import { RISK_META } from '@/lib/risk';
import type { RiskLevel } from '@/lib/types';

export function RiskBadge({ level }: { level: RiskLevel }) {
  const c = usePalette();
  const meta = RISK_META[level];
  const color = c[meta.colorKey];

  return (
    <View
      style={[styles.pill, { borderColor: color, backgroundColor: color + '1F' }]}
      accessibilityRole="text"
      accessibilityLabel={meta.a11y}>
      <IconSymbol name={meta.icon as any} size={16} color={color} />
      <Text style={[styles.label, { color }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  label: {
    fontSize: FontSizes.badge,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
