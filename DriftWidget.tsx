/**
 * EcoResolve — DriftWidget
 * Wraps any child with the zero-gravity micro-drift animation.
 */

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useDriftAnimation } from '../../hooks/useDriftAnimation';

interface DriftWidgetProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  amplitude?: number;
  speed?: number;
  phaseOffset?: number;
}

export function DriftWidget({
  children,
  style,
  amplitude,
  speed,
  phaseOffset,
}: DriftWidgetProps) {
  const driftStyle = useDriftAnimation({ amplitude, speed, phaseOffset });

  return (
    <Animated.View style={[driftStyle, style]}>
      {children}
    </Animated.View>
  );
}
