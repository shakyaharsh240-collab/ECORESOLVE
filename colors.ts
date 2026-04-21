/**
 * EcoResolve Design System — Color Palette
 * Design Language: Futuristic AI Interface · Deep Space · Zero Gravity
 */

export const Colors = {
  // ── Core Backgrounds ──────────────────────────────────────
  voidBlack: '#0A0A0B',       // Deep Obsidian — primary background
  depthLayer: '#0D0D10',      // Slightly lifted surface
  elevatedSurface: '#121218', // Widget / card layer

  // ── Primary Accent ────────────────────────────────────────
  electricCyan: '#00F2FF',
  cyanGlow: 'rgba(0, 242, 255, 0.20)',
  cyanDim: 'rgba(0, 242, 255, 0.08)',
  cyanBright: 'rgba(0, 242, 255, 0.60)',
  cyanFull: 'rgba(0, 242, 255, 0.80)',

  // ── Glow Accent ───────────────────────────────────────────
  neonPurple: '#7000FF',
  purpleAura: 'rgba(112, 0, 255, 0.25)',
  purpleRim: 'rgba(112, 0, 255, 0.12)',

  // ── Text Hierarchy ────────────────────────────────────────
  textPrimary: '#F0F0FF',
  textSecondary: 'rgba(240, 240, 255, 0.55)',
  textMuted: 'rgba(240, 240, 255, 0.28)',

  // ── Semantic ──────────────────────────────────────────────
  success: '#00FF9D',   // Neon mint
  warning: '#FFB800',   // Amber pulse
  error: '#FF3B5C',     // Neon red
  info: '#00F2FF',      // Cyan — same as primary

  // ── Glassmorphism Surface ─────────────────────────────────
  frostLight: 'rgba(255, 255, 255, 0.04)',
  frostMid: 'rgba(255, 255, 255, 0.07)',
  frostHeavy: 'rgba(255, 255, 255, 0.10)',
  frostBorder: 'rgba(255, 255, 255, 0.08)',

  // ── Transparent ───────────────────────────────────────────
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;
