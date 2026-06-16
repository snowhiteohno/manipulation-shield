import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { ActionCard } from '@/components/ActionCard';
import { Disclaimer } from '@/components/Disclaimer';
import { HighlightedMessage } from '@/components/HighlightedMessage';
import { RiskBadge } from '@/components/RiskBadge';
import { TacticCard } from '@/components/TacticCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FontSizes, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';
import type { AnalysisResult } from '@/lib/types';

export function ResultView({
  result,
  message,
  onAnalyzeAnother,
  onShare,
  onTacticPress,
}: {
  result: AnalysisResult;
  message: string;
  onAnalyzeAnother: () => void;
  onShare?: () => void;
  onTacticPress?: (tacticId: string) => void;
}) {
  const c = usePalette();
  const reduceMotion = useReducedMotion();
  const entering = reduceMotion ? undefined : FadeInDown.duration(380).springify().damping(18);

  return (
    <Animated.View entering={entering} style={styles.wrap}>
      <RiskBadge level={result.riskLevel} />
      <Text style={[styles.summary, { color: c.text }]}>{result.summary}</Text>

      {result.tactics.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.textMuted }]}>TACTICS DETECTED</Text>
          {result.tactics.map((t) => (
            <TacticCard
              key={t.tacticId}
              tactic={t}
              onPress={onTacticPress ? () => onTacticPress(t.tacticId) : undefined}
            />
          ))}
        </View>
      )}

      {result.flaggedPhrases.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.textMuted }]}>THE MESSAGE, ANNOTATED</Text>
          <HighlightedMessage message={message} flaggedPhrases={result.flaggedPhrases} />
        </View>
      )}

      <View style={styles.section}>
        <ActionCard action={result.recommendedAction} level={result.riskLevel} />
      </View>

      <View style={styles.footer}>
        <Pressable
          onPress={onAnalyzeAnother}
          accessibilityRole="button"
          accessibilityLabel="Analyze another message"
          style={[styles.footerBtn, { borderColor: c.border }]}>
          <Text style={[styles.footerText, { color: c.text }]}>Analyze another</Text>
        </Pressable>
        {onShare && (
          <Pressable
            onPress={onShare}
            accessibilityRole="button"
            accessibilityLabel="Share this result"
            style={[styles.footerBtn, { borderColor: c.border }]}>
            <IconSymbol name="square.and.arrow.up" size={16} color={c.text} />
            <Text style={[styles.footerText, { color: c.text }]}>Share</Text>
          </Pressable>
        )}
      </View>

      <Disclaimer />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.lg, marginTop: Spacing.xl },
  summary: { fontSize: FontSizes.body, lineHeight: 25, fontWeight: '500' },
  section: { gap: Spacing.md },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  footer: { flexDirection: 'row', gap: Spacing.md, flexWrap: 'wrap' },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 44,
  },
  footerText: { fontSize: FontSizes.label, fontWeight: '600' },
});
