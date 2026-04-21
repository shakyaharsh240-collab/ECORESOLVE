/**
 * EcoResolve — NeonRing
 * Animated decorative ring with scanning/radar aesthetic.
 */

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface NeonRingProps {
  size?: number;
  color?: string;
  duration?: number;
  style?: object;
}

export function NeonRing({
  size = 120,
  color = Colors.electricCyan,
  duration = 4000,
  style,
}: NeonRingProps) {
  const reducedMotion = useReducedMotion();
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) return;
    rotation.value = withRepeat(
      withTiming(360, { duration, easing: Easing.linear }),
      -1,
      false
    );
  }, [reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color,
        },
        animatedStyle,
        style,
      ]}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 1,
    borderStyle: 'dashed',
    position: 'absolute',
  },
});
