import { useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TacticListItem } from '@/components/TacticListItem';
import { FontSizes, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';
import { TACTICS } from '@/lib/tactics';

export default function TacticsScreen() {
  const c = usePalette();
  const insets = useSafeAreaInsets();
  // Deep link from a result: expand the tapped tactic.
  const { tacticId } = useLocalSearchParams<{ tacticId?: string }>();

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xxl },
      ]}
      data={TACTICS}
      keyExtractor={(t) => t.id}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={[styles.title, { color: c.text }]}>Tactic Library</Text>
          <Text style={[styles.intro, { color: c.textMuted }]}>
            The 12 techniques behind most scam messages. Learn the pattern once and you&apos;ll
            spot it next time.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <TacticListItem tactic={item} initiallyExpanded={item.id === tacticId} />
      )}
      ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  header: { gap: Spacing.sm, marginBottom: Spacing.xl },
  title: { fontSize: FontSizes.display, fontWeight: '700' },
  intro: { fontSize: FontSizes.body, lineHeight: 24 },
});
