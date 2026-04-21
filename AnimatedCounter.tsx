/**
 * EcoResolve — AnimatedCounter
 * Number roll animation — counts up from 0 to target value on mount/change.
 */

import React, { useEffect } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  style?: StyleProp<TextStyle>;
  formatter?: (n: number) => string;
}

export function AnimatedCounter({
  value,
  duration = 1200,
  style,
  formatter,
}: AnimatedCounterProps) {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value]);

  const animatedProps = useAnimatedProps(() => {
    const display = formatter
      ? formatter(Math.floor(animatedValue.value))
      : Math.floor(animatedValue.value).toLocaleString();
    return { text: display } as any;
  });

  return (
    <AnimatedText
      style={style}
      animatedProps={animatedProps}
    />
  );
}
