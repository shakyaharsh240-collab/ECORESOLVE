/**
 * EcoResolve — CyanOrb
 * Large ambient background decorative element.
 * Radial gradient with slow rotation + drift at Z-1 layer.
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

interface CyanOrbProps {
  size?: number;
  color?: string;
  opacity?: number;
  style?: object;
  duration?: number;
}

export function CyanOrb({
  size = 300,
  color = Colors.electricCyan,
  opacity = 0.15,
  style,
  duration = 25000,
}: CyanOrbProps) {
  const reducedMotion = useReducedMotion();
  const rotation = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) return;
    rotation.value = withRepeat(
      withTiming(360, { duration, easing: Easing.linear }),
      -1,
      false
    );
    translateY.value = withRepeat(
      withTiming(20, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
        animatedStyle,
        style,
      ]}
      pointerEvents="none"
    >
      {/* Simulated radial gradient using nested views */}
      <View
        style={[
          styles.core,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            opacity,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    // Heavy blur effect simulated via opacity layers
    // On iOS, use BlurView for true blur
  },
  core: {
    position: 'absolute',
  },
});
