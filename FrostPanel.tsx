/**
 * EcoResolve — FrostPanel
 * Glassmorphic content panel — the primary container element.
 */

import React, { useEffect } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Radius, Shadows } from '../../constants';

interface FrostPanelProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  level?: 'light' | 'mid' | 'heavy';
  animate?: boolean;
  zLevel?: 1 | 2 | 3;
}

export function FrostPanel({
  children,
  style,
  level = 'mid',
  animate = true,
  zLevel = 2,
}: FrostPanelProps) {
  const scale = useSharedValue(animate ? 0.92 : 1);
  const opacity = useSharedValue(animate ? 0 : 1);

  useEffect(() => {
    if (!animate) return;
    scale.value = withSpring(1, { mass: 0.75, damping: 18, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 300 });
  }, [animate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const bgColor =
    level === 'light'
      ? Colors.frostLight
      : level === 'heavy'
      ? Colors.frostHeavy
      : Colors.frostMid;

  const shadowStyle =
    zLevel === 1 ? Shadows.z1 : zLevel === 3 ? Shadows.z3 : Shadows.z2;

  return (
    <Animated.View
      style={[
        styles.panel,
        { backgroundColor: bgColor },
        shadowStyle,
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: Radius.panel,
    borderWidth: 1,
    borderColor: Colors.frostBorder,
    overflow: 'hidden',
  },
});
