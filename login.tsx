/**
 * EcoResolve — Login Screen
 * Email/password + Google Sign-In + Phone OTP entry.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeSlash, EnvelopeSimple, Lock, GoogleLogo, Phone } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing } from '../../constants';
import { GlowButton, GlowInput, FrostPanel, CyanOrb } from '../../components/ui';
import { signInWithEmail, signInWithGoogle } from '../../services/auth.service';
import { useUIStore } from '../../stores/ui.store';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useUIStore();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await signInWithEmail(data.email, data.password);
      // Auth listener in useAuth.ts will handle navigation
    } catch (err: any) {
      const message =
        err.code === 'auth/user-not-found'
          ? 'No account found with this email.'
          : err.code === 'auth/wrong-password'
          ? 'Incorrect password.'
          : err.code === 'auth/too-many-requests'
          ? 'Too many attempts. Try again later.'
          : 'Sign in failed. Please try again.';
      showToast(message, 'error');
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      showToast('Google sign-in failed. Please try again.', 'error');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.base, paddingBottom: insets.bottom + Spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Background orb */}
        <CyanOrb size={350} opacity={0.06} style={styles.bgOrb} duration={28000} />

        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue your eco journey</Text>
        </View>

        {/* Form */}
        <FrostPanel style={styles.formPanel} animate>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <GlowInput
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                leftIcon={
                  <EnvelopeSimple size={18} color={Colors.textMuted} weight="regular" />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <GlowInput
                label="Password"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                autoComplete="password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                leftIcon={
                  <Lock size={18} color={Colors.textMuted} weight="regular" />
                }
                rightIcon={
                  showPassword ? (
                    <EyeSlash size={18} color={Colors.textMuted} weight="regular" />
                  ) : (
                    <Eye size={18} color={Colors.textMuted} weight="regular" />
                  )
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            )}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <GlowButton
            label="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            fullWidth
            style={styles.submitButton}
          />
        </FrostPanel>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social / Phone options */}
        <View style={styles.socialRow}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogleSignIn}
            disabled={googleLoading}
          >
            <GoogleLogo size={22} color={Colors.textPrimary} weight="bold" />
            <Text style={styles.socialLabel}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => router.push('/(auth)/otp')}
          >
            <Phone size={22} color={Colors.textPrimary} weight="regular" />
            <Text style={styles.socialLabel}>Phone</Text>
          </TouchableOpacity>
        </View>

        {/* Sign up link */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
  bgOrb: {
    position: 'absolute',
    top: -50,
    right: -100,
  },
  backButton: {
    marginBottom: Spacing.xl,
  },
  backText: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  formPanel: {
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.base,
    marginTop: -Spacing.sm,
  },
  forgotText: {
    color: Colors.electricCyan,
    fontSize: FontSize.sm,
  },
  submitButton: {
    marginTop: Spacing.xs,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.frostBorder,
  },
  dividerText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  socialRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.frostLight,
    borderWidth: 1,
    borderColor: Colors.frostBorder,
    borderRadius: 12,
    paddingVertical: Spacing.base,
  },
  socialLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  signupLink: {
    color: Colors.electricCyan,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
});
