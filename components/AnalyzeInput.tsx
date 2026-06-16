import * as Clipboard from 'expo-clipboard';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CharCounter } from '@/components/CharCounter';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FontSizes, Radius, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';

export function AnalyzeInput({
  value,
  onChange,
  max,
}: {
  value: string;
  onChange: (text: string) => void;
  max: number;
}) {
  const c = usePalette();

  async function paste() {
    const text = await Clipboard.getStringAsync();
    if (text) onChange(text.slice(0, max));
  }

  return (
    <View
      style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
      <TextInput
        style={[styles.input, { color: c.text }]}
        multiline
        placeholder="Paste a message you're unsure about."
        placeholderTextColor={c.textMuted}
        value={value}
        onChangeText={onChange}
        maxLength={max + 200 /* allow brief over-limit so we can warn, not truncate silently */}
        textAlignVertical="top"
        accessibilityLabel="Message to analyze"
      />
      <View style={styles.row}>
        <CharCounter count={value.length} max={max} />
        <View style={styles.actions}>
          <Pressable
            onPress={paste}
            hitSlop={8}
            style={styles.actionBtn}
            accessibilityRole="button"
            accessibilityLabel="Paste from clipboard">
            <IconSymbol name="doc.on.clipboard" size={18} color={c.accent} />
            <Text style={[styles.actionText, { color: c.accent }]}>Paste</Text>
          </Pressable>
          {value.length > 0 && (
            <Pressable
              onPress={() => onChange('')}
              hitSlop={8}
              style={styles.actionBtn}
              accessibilityRole="button"
              accessibilityLabel="Clear input">
              <IconSymbol name="xmark" size={16} color={c.textMuted} />
              <Text style={[styles.actionText, { color: c.textMuted }]}>Clear</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  input: {
    fontSize: FontSizes.body,
    lineHeight: 24,
    minHeight: 140,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  actions: { flexDirection: 'row', gap: Spacing.lg },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 44,
  },
  actionText: { fontSize: FontSizes.label, fontWeight: '600' },
});
