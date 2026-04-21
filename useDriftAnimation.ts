/**
 * EcoResolve — Zero-Gravity Micro-Drift Animation Hook
 *
 * Applies a sinusoidal Y + slight X oscillation to any component.
 * Runs entirely on the UI thread via Reanimated 3 worklets.
 */

import { useEffect, useMemo } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useReducedMotion } from './useReducedMotion';

interface DriftConfig {
  amplitude?: number;   // px, default random 3–8
  speed?: number;       // ms per full cycle, default random 4000–8000
  phaseOffset?: number; // radians, default random 0–2π
}

export function useDriftAnimation(config?: DriftConfig) {
  const reducedMotion = useReducedMotion();

  const amplitude = useMemo(
    () => config?.amplitude ?? 3 + Math.random() * 5,
    []
  );
  const speed = useMemo(
    () => config?.speed ?? 4000 + Math.random() * 4000,
    []
  );
  const phaseOffset = useMemo(
    () => config?.phaseOffset ?? Math.random() * Math.PI * 2,
    []
  );

  const progress = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) return;
    progress.value = withRepeat(
      withTiming(1, { duration: speed, easing: Easing.linear }),
      -1, // infinite
      false
    );
  }, [reducedMotion, speed]);

  const animatedStyle = useAnimatedStyle(() => {
    if (reducedMotion) return {};
    const angle = progress.value * Math.PI * 2 + phaseOffset;
    const translateY = amplitude * Math.sin(angle);
    const translateX = amplitude * 0.4 * Math.cos(angle * 0.7);
    return {
      transform: [{ translateY }, { translateX }],
    };
  });

  return animatedStyle;
}
