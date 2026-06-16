/**
 * Design tokens for Manipulation Shield. See FRONTEND-SPEC.md §2–3.
 * Light and dark are supported (app.json userInterfaceStyle is automatic).
 * The keys text/background/tint/icon/tabIcon* are consumed by useThemeColor
 * and the navigation theme, so they are kept; risk + surface tokens are added.
 */

import { Platform } from 'react-native';

const accent = '#3B6FE0'; // calm blue, primary action only

// Risk semantics are paired ALWAYS with a label + icon, never color alone.
// Kept identical across modes so the meaning is stable.
const risk = {
  riskLow: '#2E9E6B', // leaf green
  riskSuspicious: '#D9913B', // amber
  riskHigh: '#D8503C', // warm red
};

export const Colors = {
  light: {
    text: '#16181D',
    textMuted: '#6B7280',
    background: '#FBFBFC',
    surface: '#FFFFFF',
    border: '#E7E7EC',
    tint: accent,
    accent,
    icon: '#6B7280',
    tabIconDefault: '#6B7280',
    tabIconSelected: accent,
    ...risk,
  },
  dark: {
    text: '#F2F3F5',
    textMuted: '#9AA3B2',
    background: '#0F1115',
    surface: '#161922',
    border: '#262B36',
    tint: accent,
    accent,
    icon: '#9AA3B2',
    tabIconDefault: '#9AA3B2',
    tabIconSelected: accent,
    ...risk,
  },
};

export type ColorScheme = 'light' | 'dark';
export type Palette = typeof Colors.light;

// Risk-color lookup keyed by RiskLevel.
export const RiskColorKey = {
  low: 'riskLow',
  suspicious: 'riskSuspicious',
  high: 'riskHigh',
} as const;

export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const Radius = { card: 14, pill: 999 } as const;

export const FontSizes = {
  display: 28,
  heading: 17,
  body: 16,
  label: 13,
  badge: 13,
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
