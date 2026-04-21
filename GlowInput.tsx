/**
 * EcoResolve — GlowInput
 * Futuristic text input with cyan focus glow.
 */

import React, { useState, forwardRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Radius, FontSize, Spacing, Shadows } from '../../constants';

interface GlowInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export const GlowInput = forwardRef<TextInput, GlowInputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      onFocus,
      onBlur,
      style,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const borderOpacity = useSharedValue(0);
    const glowOpacity = useSharedValue(0);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      borderOpacity.value = withTiming(1, { duration: 200 });
      glowOpacity.value = withTiming(1, { duration: 200 });
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      borderOpacity.value = withTiming(0, { duration: 200 });
      glowOpacity.value = withTiming(0, { duration: 200 });
      onBlur?.(e);
    };

    const borderStyle = useAnimatedStyle(() => ({
      borderColor: error
        ? Colors.error
        : `rgba(0, 242, 255, ${borderOpacity.value})`,
    }));

    const glowStyle = useAnimatedStyle(() => ({
      shadowOpacity: glowOpacity.value * 0.4,
    }));

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}

        <Animated.View
          style={[
            styles.inputWrapper,
            error ? styles.errorBorder : styles.defaultBorder,
            borderStyle,
            {
              shadowColor: Colors.electricCyan,
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 12,
              elevation: isFocused ? 4 : 0,
            },
            glowStyle,
          ]}
        >
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              leftIcon ? styles.inputWithLeft : null,
              rightIcon ? styles.inputWithRight : null,
              style,
            ]}
            placeholderTextColor={Colors.textMuted}
            onFocus={handleFocus}
            onBlur={handleBlur}
            selectionColor={Colors.electricCyan}
            {...props}
          />

          {rightIcon && (
            <TouchableOpacity
              style={styles.rightIcon}
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </Animated.View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : hint ? (
          <Text style={styles.hintText}>{hint}</Text>
        ) : null}
      </View>
    );
  }
);

GlowInput.displayName = 'GlowInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginBottom: Spacing.xs,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.frostLight,
    borderRadius: Radius.input,
    borderWidth: 1,
    minHeight: 52,
  },
  defaultBorder: {
    borderColor: Colors.frostBorder,
  },
  errorBorder: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  inputWithLeft: {
    paddingLeft: Spacing.xs,
  },
  inputWithRight: {
    paddingRight: Spacing.xs,
  },
  leftIcon: {
    paddingLeft: Spacing.base,
  },
  rightIcon: {
    paddingRight: Spacing.base,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },
  hintText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },
});
