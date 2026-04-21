/**
 * EcoResolve Design System — Glow & Shadow System
 * Note: React Native uses shadowColor/shadowOffset/elevation for shadows.
 * These are style objects to spread into components.
 */

import { Colors } from './colors';

// For web/iOS shadow support
export const Shadows = {
  // Frosted Float (Widget Depth)
  z1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 24,
    elevation: 4,
  },
  z2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 40,
    elevation: 8,
  },
  z3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.70,
    shadowRadius: 64,
    elevation: 16,
  },

  // Cyan Glow (Primary Interactions)
  cyanIdle: {
    shadowColor: Colors.electricCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 6,
  },
  cyanActive: {
    shadowColor: Colors.electricCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.80,
    shadowRadius: 40,
    elevation: 12,
  },

  // Purple Bloom (Decorative / Ambient)
  purpleAmbient: {
    shadowColor: Colors.neonPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 80,
    elevation: 4,
  },
} as const;
