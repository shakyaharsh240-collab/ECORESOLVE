/**
 * EcoResolve — Welcome / Splash Screen
 * Animated logo reveal + tagline + entry CTAs.
 */

import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants';
import { CyanOrb, NeonRing, GlowButton } from '../../components/ui';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  // Logo animations
  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const logoGlow = useSharedValue(0.3);

  // Tagline animations
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(24);

  // Subtitle animations
  const subtitleOpacity = useSharedValue(0);
  const subtitleY = useSharedValue(20);

  // CTA animations
  const ctaOpacity = useSharedValue(0);
  const ctaY = useSharedValue(30);

  useEffect(() => {
    // Logo entrance
    logoScale.value = withDelay(
      200,
      withSpring(1, { mass: 0.8, damping: 14, stiffness: 180 })
    );
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));

    // Logo pulse loop
    logoGlow.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.3, { duration: 1800, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );

    // Tagline reveal
    taglineOpacity.value = withDelay(700, withTiming(1, { duration: 700 }));
    taglineY.value = withDelay(700, withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) }));

    // Subtitle
    subtitleOpacity.value = withDelay(1000, withTiming(1, { duration: 600 }));
    subtitleY.value = withDelay(1000, withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }));

    // CTAs
    ctaOpacity.value = withDelay(1400, withTiming(1, { duration: 600 }));
    ctaY.value = withDelay(1400, withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const logoGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: logoGlow.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleY.value }],
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaY.value }],
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Ambient background orbs */}
      <CyanOrb
        size={400}
        opacity={0.08}
        style={{ top: -100, left: -100 }}
        duration={30000}
      />
      <CyanOrb
        size={300}
        color={Colors.neonPurple}
        opacity={0.06}
        style={{ bottom: 100, right: -80 }}
        duration={22000}
      />

      {/* Decorative rings */}
      <NeonRing size={200} style={styles.ring1} duration={6000} />
      <NeonRing
        size={140}
        color={Colors.neonPurple}
        style={styles.ring2}
        duration={8000}
      />

      {/* Logo */}
      <View style={styles.logoSection}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              shadowColor: Colors.electricCyan,
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 40,
              elevation: 12,
            },
            logoStyle,
            logoGlowStyle,
          ]}
        >
          <Text style={styles.logoEmoji}>♻️</Text>
        </Animated.View>

        <Animated.Text style={[styles.logoText, logoStyle]}>
          EcoResolve
        </Animated.Text>
      </View>

      {/* Tagline */}
      <Animated.View style={[styles.taglineSection, taglineStyle]}>
        <Text style={styles.tagline}>Turn Waste Into Worth</Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View style={[styles.subtitleSection, subtitleStyle]}>
        <Text style={styles.subtitle}>
          Join the circular economy. Collect waste, earn tokens, build a greener world.
        </Text>
      </Animated.View>

      {/* CTAs */}
      <Animated.View style={[styles.ctaSection, ctaStyle]}>
        <GlowButton
          label="Get Started"
          onPress={() => router.push('/(auth)/signup')}
          size="lg"
          fullWidth
        />
        <View style={styles.ctaGap} />
        <GlowButton
          label="Sign In"
          onPress={() => router.push('/(auth)/login')}
          variant="ghost"
          size="lg"
          fullWidth
        />

        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    overflow: 'hidden',
  },
  ring1: {
    top: height * 0.15,
    right: -60,
    opacity: 0.3,
  },
  ring2: {
    bottom: height * 0.25,
    left: -40,
    opacity: 0.2,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.cyanDim,
    borderWidth: 2,
    borderColor: Colors.electricCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  logoEmoji: {
    fontSize: 48,
  },
  logoText: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  taglineSection: {
    marginBottom: Spacing.base,
  },
  tagline: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.electricCyan,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitleSection: {
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.base,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaSection: {
    width: '100%',
    alignItems: 'center',
  },
  ctaGap: {
    height: Spacing.md,
  },
  termsText: {
    marginTop: Spacing.base,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.electricCyan,
  },
});
