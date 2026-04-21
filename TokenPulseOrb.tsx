/**
 * EcoResolve — TokenPulseOrb
 * Token balance display widget with pulsing cyan glow.
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors, FontSize, FontWeight, Spacing } from '../../constants';

interface TokenPulseOrbProps {
  balance: number;
  size?: number;
  label?: string;
}

export function TokenPulseOrb({ balance, size = 96, label = 'ECT' }: TokenPulseOrbProps) {
  const pulse = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.0, { duration: 1200, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1200 }),
        withTiming(0.3, { duration: 1200 })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          shadowColor: Colors.electricCyan,
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 24,
          elevation: 8,
        },
        pulseStyle,
        glowStyle,
      ]}
    >
      <Text style={styles.balance}>{balance.toLocaleString()}</Text>
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  orb: {
    backgroundColor: Colors.cyanDim,
    borderWidth: 1.5,
    borderColor: Colors.electricCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balance: {
    color: Colors.electricCyan,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    fontVariant: ['tabular-nums'],
  },
  label: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
    letterSpacing: 1,
  },
});
