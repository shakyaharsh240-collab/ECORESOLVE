/**
 * EcoResolve — HapticRingNode
 * The primary interactive element — replaces standard buttons.
 * Circular ring with cyan glow, spring expand, haptic feedback.
 */

import React, { useCallback } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, NodeSize, Shadows } from '../../constants';
import { useHaptic } from '../../hooks/useHaptic';

type NodeSizeKey = 'xs' | 'sm' | 'md' | 'lg';

interface HapticRingNodeProps {
  onPress?: () => void;
  size?: NodeSizeKey;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  glowColor?: string;
  disabled?: boolean;
  active?: boolean;
}

export function HapticRingNode({
  onPress,
  size = 'md',
  children,
  style,
  glowColor = Colors.electricCyan,
  disabled = false,
  active = false,
}: HapticRingNodeProps) {
  const haptic = useHaptic();
  const diameter = NodeSize[size];

  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(active ? 0.6 : 0.3);
  const ringScale = useSharedValue(1);

  const handlePress = useCallback(() => {
    // Press animation: scale down then snap back
    scale.value = withSequence(
      withTiming(0.93, { duration: 120 }),
      withSpring(1, { mass: 0.5, damping: 12, stiffness: 300 })
    );
    // Glow burst
    glowOpacity.value = withSequence(
      withTiming(0.9, { duration: 80 }),
      withTiming(0.3, { duration: 300 })
    );
    // Ring expand
    ringScale.value = withSequence(
      withSpring(1.25, { mass: 0.5, damping: 10, stiffness: 200 }),
      withSpring(1, { mass: 0.5, damping: 14, stiffness: 200 })
    );

    runOnJS(haptic.medium)();
    if (onPress) runOnJS(onPress)();
  }, [onPress]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    shadowOpacity: glowOpacity.value,
  }));

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={1}
      style={style}
    >
      <Animated.View style={[containerStyle]}>
        {/* Outer glow ring */}
        <Animated.View
          style={[
            styles.ring,
            {
              width: diameter,
              height: diameter,
              borderRadius: diameter / 2,
              borderColor: glowColor,
              shadowColor: glowColor,
            },
            Shadows.cyanIdle,
            ringStyle,
          ]}
        >
          {/* Inner content */}
          <View
            style={[
              styles.inner,
              {
                width: diameter - 8,
                height: diameter - 8,
                borderRadius: (diameter - 8) / 2,
              },
            ]}
          >
            {children}
          </View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cyanDim,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
