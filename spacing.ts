/**
 * EcoResolve Design System — Spacing & Layout
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  huge: 96,
} as const;

export const Radius = {
  node: 9999,   // circular haptic-ring nodes (50%)
  widget: 20,   // floating organic widgets
  panel: 28,    // expanded glassmorphic panels
  pill: 999,    // badges / chips
  input: 12,
  sm: 8,
  md: 16,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,
  xxxl: 38,
  display: 48,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const NodeSize = {
  xs: 40,
  sm: 56,
  md: 72,
  lg: 96,
} as const;
