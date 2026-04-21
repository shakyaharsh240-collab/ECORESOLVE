/**
 * EcoResolve — Sign Up Screen
 * Email/password registration + profile photo upload.
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
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as ImagePicker from 'expo-image-picker';
import {
  User,
  EnvelopeSimple,
  Lock,
  Eye,
  EyeSlash,
  Camera,
  GoogleLogo,
} from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants';
import { GlowButton, GlowInput, FrostPanel, CyanOrb } from '../../components/ui';
import {
  signUpWithEmail,
  signInWithGoogle,
  uploadProfilePhoto,
} from '../../services/auth.service';
import { useUIStore } from '../../stores/ui.store';
import { auth } from '../../services/firebase';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useUIStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast('Photo library permission required.', 'warning');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: SignupForm) => {
    try {
      const user = await signUpWithEmail(data.email, data.password, data.name);
      if (photoUri) {
        await uploadProfilePhoto(user.uid, photoUri);
      }
      router.replace('/(auth)/role-select');
    } catch (err: any) {
      const message =
        err.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists.'
          : err.code === 'auth/weak-password'
          ? 'Password is too weak.'
          : 'Sign up failed. Please try again.';
      showToast(message, 'error');
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.replace('/(auth)/role-select');
    } catch {
      showToast('Google sign-in failed.', 'error');
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
        <CyanOrb size={300} opacity={0.07} style={styles.bgOrb} duration={26000} />

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Join the circular economy movement</Text>
        </View>

        {/* Profile photo picker */}
        <TouchableOpacity style={styles.photoPicker} onPress={pickPhoto}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Camera size={28} color={Colors.electricCyan} weight="regular" />
            </View>
          )}
          <Text style={styles.photoLabel}>
            {photoUri ? 'Change photo' : 'Add profile photo'}
          </Text>
        </TouchableOpacity>

        <FrostPanel style={styles.formPanel} animate>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <GlowInput
                label="Full Name"
                placeholder="Your name"
                autoCapitalize="words"
                autoComplete="name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
                leftIcon={<User size={18} color={Colors.textMuted} weight="regular" />}
              />
            )}
          />

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
                placeholder="Min. 8 characters"
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                leftIcon={<Lock size={18} color={Colors.textMuted} weight="regular" />}
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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <GlowInput
                label="Confirm Password"
                placeholder="Repeat password"
                secureTextEntry={!showConfirm}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                leftIcon={<Lock size={18} color={Colors.textMuted} weight="regular" />}
                rightIcon={
                  showConfirm ? (
                    <EyeSlash size={18} color={Colors.textMuted} weight="regular" />
                  ) : (
                    <Eye size={18} color={Colors.textMuted} weight="regular" />
                  )
                }
                onRightIconPress={() => setShowConfirm(!showConfirm)}
              />
            )}
          />

          <GlowButton
            label="Create Account"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            fullWidth
            style={styles.submitButton}
          />
        </FrostPanel>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          disabled={googleLoading}
        >
          <GoogleLogo size={22} color={Colors.textPrimary} weight="bold" />
          <Text style={styles.googleLabel}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Sign in link */}
        <View style={styles.signinRow}>
          <Text style={styles.signinText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.signinLink}>Sign in</Text>
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
    top: 0,
    left: -80,
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
  photoPicker: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.cyanDim,
    borderWidth: 2,
    borderColor: Colors.electricCyan,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.electricCyan,
  },
  photoLabel: {
    color: Colors.electricCyan,
    fontSize: FontSize.sm,
  },
  formPanel: {
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  submitButton: {
    marginTop: Spacing.xs,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.frostLight,
    borderWidth: 1,
    borderColor: Colors.frostBorder,
    borderRadius: 12,
    paddingVertical: Spacing.base,
    marginBottom: Spacing.xl,
  },
  googleLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signinText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  signinLink: {
    color: Colors.electricCyan,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
});
