import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnalyzeButton } from '@/components/AnalyzeButton';
import { AnalyzeInput } from '@/components/AnalyzeInput';
import { ResultView } from '@/components/ResultView';
import { EmptyState } from '@/components/states/EmptyState';
import { ErrorState } from '@/components/states/ErrorState';
import { LoadingState } from '@/components/states/LoadingState';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FontSizes, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';
import { analyzeMessage } from '@/lib/gemini';
import { MAX_MESSAGE_CHARS } from '@/lib/prompt';
import { RISK_META } from '@/lib/risk';
import { AnalysisError, type AnalysisErrorCode, type AnalysisResult } from '@/lib/types';

type Status =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'result'; result: AnalysisResult; message: string }
  | { kind: 'error'; code: AnalysisErrorCode };

export default function AnalyzeScreen() {
  const c = usePalette();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const trimmedLen = message.trim().length;
  const overLimit = message.length > MAX_MESSAGE_CHARS;
  const canAnalyze = trimmedLen > 0 && !overLimit;

  async function runAnalysis() {
    const snapshot = message;
    setStatus({ kind: 'loading' });
    try {
      const result = await analyzeMessage(snapshot);
      setStatus({ kind: 'result', result, message: snapshot });
      hapticFor(result);
    } catch (e) {
      const code = e instanceof AnalysisError ? e.code : 'service';
      setStatus({ kind: 'error', code });
    }
  }

  function hapticFor(result: AnalysisResult) {
    if (Platform.OS === 'web') return;
    const style =
      result.riskLevel === 'high'
        ? Haptics.NotificationFeedbackType.Error
        : result.riskLevel === 'suspicious'
          ? Haptics.NotificationFeedbackType.Warning
          : Haptics.NotificationFeedbackType.Success;
    Haptics.notificationAsync(style).catch(() => {});
  }

  function analyzeAnother() {
    setStatus({ kind: 'idle' });
    setMessage('');
  }

  async function share() {
    if (status.kind !== 'result') return;
    const { result } = status;
    const tactics = result.tactics.map((t) => `• ${t.name}`).join('\n');
    const text = [
      `Manipulation Shield — risk: ${RISK_META[result.riskLevel].label}`,
      result.summary,
      tactics && `\nTactics:\n${tactics}`,
      `\nWhat to do: ${result.recommendedAction}`,
      '\n(AI explanation, can be wrong — verify through official channels.)',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await Share.share({ message: text });
    } catch {
      // user cancelled or platform unsupported; nothing to do
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: c.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xxl },
        ]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.column}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <IconSymbol name="shield.lefthalf.filled" size={26} color={c.accent} />
              <Text style={[styles.title, { color: c.text }]}>Manipulation Shield</Text>
            </View>
            <Pressable
              onPress={() => router.push('/modal')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="About and privacy">
              <IconSymbol name="info.circle" size={24} color={c.textMuted} />
            </Pressable>
          </View>

          <AnalyzeInput value={message} onChange={setMessage} max={MAX_MESSAGE_CHARS} />

          {overLimit && (
            <Text style={[styles.warn, { color: c.riskHigh }]}>
              That&apos;s a bit long. Trim it to {MAX_MESSAGE_CHARS.toLocaleString()} characters.
            </Text>
          )}

          <AnalyzeButton
            onPress={runAnalysis}
            disabled={!canAnalyze}
            loading={status.kind === 'loading'}
          />

          {status.kind === 'idle' && <EmptyState />}
          {status.kind === 'loading' && <LoadingState />}
          {status.kind === 'error' && (
            <View style={styles.resultArea}>
              <ErrorState code={status.code} onRetry={runAnalysis} />
            </View>
          )}
          {status.kind === 'result' && (
            <ResultView
              result={status.result}
              message={status.message}
              onAnalyzeAnother={analyzeAnother}
              onShare={Platform.OS === 'web' ? undefined : share}
              onTacticPress={(tacticId) =>
                router.push({ pathname: '/(tabs)/explore', params: { tacticId } })
              }
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.lg },
  column: { width: '100%', maxWidth: 560, alignSelf: 'center', gap: Spacing.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexShrink: 1 },
  title: { fontSize: FontSizes.display, fontWeight: '700', flexShrink: 1 },
  warn: { fontSize: FontSizes.label, fontWeight: '500' },
  resultArea: { marginTop: Spacing.md },
});
