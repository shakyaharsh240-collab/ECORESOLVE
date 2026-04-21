/**
 * EcoResolve — Toast Notification
 * Global toast overlay for success/error/info/warning messages.
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, Radius, Spacing } from '../../constants';
import { useUIStore } from '../../stores/ui.store';

export function Toast() {
  const { activeToast, hideToast } = useUIStore();
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (activeToast) {
      translateY.value = withSpring(0, { mass: 0.6, damping: 16, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });

      // Auto-dismiss after 3s
      const timer = setTimeout(() => {
        translateY.value = withTiming(-100, { duration: 250 });
        opacity.value = withTiming(0, { duration: 250 }, () => {
          runOnJS(hideToast)();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!activeToast) return null;

  const borderColor =
    activeToast.type === 'success'
      ? Colors.success
      : activeToast.type === 'error'
      ? Colors.error
      : activeToast.type === 'warning'
      ? Colors.warning
      : Colors.electricCyan;

  return (
    <Animated.View
      style={[
        styles.toast,
        { top: insets.top + Spacing.sm, borderLeftColor: borderColor },
        animatedStyle,
      ]}
    >
      <Text style={styles.message}>{activeToast.message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: Spacing.base,
    right: Spacing.base,
    backgroundColor: Colors.elevatedSurface,
    borderRadius: Radius.widget,
    borderWidth: 1,
    borderColor: Colors.frostBorder,
    borderLeftWidth: 3,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 20,
  },
  message: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
});
