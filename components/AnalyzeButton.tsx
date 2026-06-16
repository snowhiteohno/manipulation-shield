import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { FontSizes, Radius } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';

export function AnalyzeButton({
  onPress,
  disabled,
  loading,
}: {
  onPress: () => void;
  disabled: boolean;
  loading: boolean;
}) {
  const c = usePalette();
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      accessibilityLabel={loading ? 'Reading the message' : 'Analyze message'}
      style={[styles.button, { backgroundColor: c.accent }, inactive && styles.disabled]}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>Analyze message</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.card,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: { opacity: 0.4 },
  text: { color: '#fff', fontSize: FontSizes.body, fontWeight: '600' },
});
