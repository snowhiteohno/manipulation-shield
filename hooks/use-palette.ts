import { Colors, type Palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Returns the full color palette for the active light/dark scheme. */
export function usePalette(): Palette {
  const scheme = useColorScheme() ?? 'light';
  return Colors[scheme];
}
