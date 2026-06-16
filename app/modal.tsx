import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Disclaimer } from '@/components/Disclaimer';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FontSizes, Radius, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';
import { isMockMode } from '@/lib/gemini';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const c = usePalette();
  return (
    <View style={styles.section}>
      <Text style={[styles.heading, { color: c.text }]}>{title}</Text>
      {children}
    </View>
  );
}

export default function AboutScreen() {
  const c = usePalette();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={styles.content}>
      <View style={styles.column}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: c.text }]}>About &amp; Privacy</Text>
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Close">
            <IconSymbol name="xmark" size={22} color={c.textMuted} />
          </Pressable>
        </View>

        <Section title="What this does">
          <Text style={[styles.body, { color: c.text }]}>
            Paste a message you&apos;re unsure about and Manipulation Shield names the
            psychological technique it&apos;s using, highlights the manipulative phrases, and tells
            you one safe thing to do next.
          </Text>
        </Section>

        <Section title="Your privacy">
          <Text style={[styles.body, { color: c.text }]}>
            No account, no login. The message is never stored by this app and there is no history.
          </Text>
          <Text style={[styles.body, { color: c.text, marginTop: Spacing.md }]}>
            To analyze it, the message is sent to Google&apos;s Gemini API, so it does leave your
            device and is handled under Google&apos;s API terms. We tell you this plainly because
            the whole point of this app is not being misled.
          </Text>
        </Section>

        <Section title="Accuracy">
          <Text style={[styles.body, { color: c.text }]}>
            For anything important — money, accounts, legal threats — verify through official
            channels: call your bank using the number on your card, not a number from the message.
            This app explains technique; it is not legal or financial advice.
          </Text>
          <Disclaimer />
        </Section>

        {isMockMode && (
          <View style={[styles.note, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.noteText, { color: c.textMuted }]}>
              Developer note: running in mock mode (no Gemini key set). Results are sample data, not
              a real analysis.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  column: { width: '100%', maxWidth: 560, alignSelf: 'center', gap: Spacing.xl },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: FontSizes.display, fontWeight: '700' },
  section: { gap: Spacing.sm },
  heading: { fontSize: FontSizes.heading, fontWeight: '600' },
  body: { fontSize: FontSizes.body, lineHeight: 24 },
  note: {
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: Spacing.md,
  },
  noteText: { fontSize: FontSizes.label, lineHeight: 19 },
});
