/**
 * EcoResolve — SkeletonDrift
 * Shimmer skeleton loader with micro-drift animation.
 */

import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Colors, Radius } from '../../constants';
import { useDriftAnimation } from '../../hooks/useDriftAnimation';

interface SkeletonDriftProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonDrift({
  width = '100%',
  height = 20,
  borderRadius = Radius.sm,
  style,
}: SkeletonDriftProps) {
  const shimmer = useSharedValue(0);
  const driftStyle = useDriftAnimation({ amplitude: 2, speed: 5000 });

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmer.value, [0, 1], [-200, 200]);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { width: width as any, height, borderRadius },
        driftStyle,
        style,
      ]}
    >
      <Animated.View style={[styles.shimmer, shimmerStyle]} />
    </Animated.View>
  );
}

// Preset skeleton layouts
export function SkeletonCard({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.card, style]}>
      <SkeletonDrift width={60} height={60} borderRadius={30} />
      <View style={styles.cardContent}>
        <SkeletonDrift width="70%" height={16} />
        <SkeletonDrift width="50%" height={12} style={{ marginTop: 8 }} />
        <SkeletonDrift width="90%" height={12} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.frostLight,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: 'rgba(0, 242, 255, 0.05)',
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
});
