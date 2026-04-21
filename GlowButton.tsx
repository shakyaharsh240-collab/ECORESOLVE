/**
 * EcoResolve — GlowButton
 * Primary CTA button with cyan glow effect.
 */

import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, Radius, FontSize, FontWeight, Shadows, Spacing } from '../../constants';
import { useHaptic } from '../../hooks/useHaptic';

interface GlowButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}

export function GlowButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  fullWidth = false,
}: GlowButtonProps) {
  const haptic = useHaptic();
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    scale.value = withSequence(
      withTiming(0.96, { duration: 100 }),
      withSpring(1, { mass: 0.5, damping: 12 })
    );
    runOnJS(haptic.medium)();
    runOnJS(onPress)();
  }, [onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isDisabled = disabled || loading;

  const bgColor =
    variant === 'primary'
      ? Colors.electricCyan
      : variant === 'secondary'
      ? Colors.frostMid
      : variant === 'danger'
      ? Colors.error
      : Colors.transparent;

  const textColor =
    variant === 'primary'
      ? Colors.voidBlack
      : variant === 'danger'
      ? Colors.textPrimary
      : Colors.electricCyan;

  const paddingV = size === 'sm' ? Spacing.sm : size === 'lg' ? Spacing.base + 4 : Spacing.base;
  const fontSize = size === 'sm' ? FontSize.sm : size === 'lg' ? FontSize.md : FontSize.base;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={1}
      style={[fullWidth && styles.fullWidth, style]}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: bgColor,
            paddingVertical: paddingV,
            opacity: isDisabled ? 0.5 : 1,
          },
          variant === 'primary' && Shadows.cyanIdle,
          variant === 'ghost' && styles.ghostBorder,
          animatedStyle,
          fullWidth && styles.fullWidth,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? Colors.voidBlack : Colors.electricCyan}
          />
        ) : (
          <Text
            style={[
              styles.label,
              { color: textColor, fontSize },
            ]}
          >
            {label}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 48,
  },
  ghostBorder: {
    borderWidth: 1.5,
    borderColor: Colors.electricCyan,
  },
  label: {
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.3,
  },
  fullWidth: {
    width: '100%',
  },
});
