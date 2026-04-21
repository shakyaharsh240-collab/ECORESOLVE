/**
 * EcoResolve — OTP / Phone Auth Screen
 * Phone number entry + 6-digit OTP verification.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Phone, ArrowRight } from 'phosphor-react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants';
import { GlowButton, GlowInput, FrostPanel, CyanOrb } from '../../components/ui';
import { useUIStore } from '../../stores/ui.store';

type Step = 'phone' | 'otp';

export default function OTPScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useUIStore();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOTP = async () => {
    if (phone.length < 10) {
      showToast('Enter a valid phone number.', 'error');
      return;
    }
    setLoading(true);
    try {
      // In production: await sendOTP('+91' + phone, recaptchaVerifier)
      // For now, simulate OTP send
      await new Promise((r) => setTimeout(r, 1000));
      setStep('otp');
      setResendTimer(30);
      showToast('OTP sent successfully!', 'success');
    } catch {
      showToast('Failed to send OTP. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (index === 5 && value) {
      const fullOtp = [...newOtp.slice(0, 5), value].join('');
      if (fullOtp.length === 6) handleVerifyOTP(fullOtp);
    }
  };

  const handleOTPKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (code?: string) => {
    const otpCode = code ?? otp.join('');
    if (otpCode.length !== 6) {
      showToast('Enter the complete 6-digit OTP.', 'error');
      return;
    }
    setLoading(true);
    try {
      // await verifyOTP(otpCode);
      await new Promise((r) => setTimeout(r, 1000));
      router.replace('/(auth)/role-select');
    } catch {
      showToast('Invalid OTP. Please try again.', 'error');
    } finally {
      setLoading(false);
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
      >
        <CyanOrb size={280} opacity={0.07} style={styles.bgOrb} />

        <TouchableOpacity
          onPress={() => (step === 'otp' ? setStep('phone') : router.back())}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Phone size={32} color={Colors.electricCyan} weight="fill" />
          </View>
          <Text style={styles.title}>
            {step === 'phone' ? 'Phone Sign In' : 'Verify OTP'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'phone'
              ? 'Enter your mobile number to receive a verification code'
              : `We sent a 6-digit code to +91 ${phone}`}
          </Text>
        </View>

        <FrostPanel style={styles.formPanel} animate>
          {step === 'phone' ? (
            <>
              <GlowInput
                label="Mobile Number"
                placeholder="10-digit number"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
                leftIcon={
                  <Text style={styles.countryCode}>+91</Text>
                }
              />
              <GlowButton
                label="Send OTP"
                onPress={handleSendOTP}
                loading={loading}
                fullWidth
              />
            </>
          ) : (
            <>
              <Text style={styles.otpLabel}>Enter 6-digit OTP</Text>
              <View style={styles.otpRow}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => { otpRefs.current[index] = ref; }}
                    style={[
                      styles.otpInput,
                      digit ? styles.otpInputFilled : null,
                    ]}
                    value={digit}
                    onChangeText={(v) => handleOTPChange(v.slice(-1), index)}
                    onKeyPress={({ nativeEvent }) =>
                      handleOTPKeyPress(nativeEvent.key, index)
                    }
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    selectionColor={Colors.electricCyan}
                  />
                ))}
              </View>

              <GlowButton
                label="Verify OTP"
                onPress={() => handleVerifyOTP()}
                loading={loading}
                fullWidth
                style={styles.verifyButton}
              />

              <View style={styles.resendRow}>
                {resendTimer > 0 ? (
                  <Text style={styles.resendTimer}>
                    Resend in {resendTimer}s
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleSendOTP}>
                    <Text style={styles.resendLink}>Resend OTP</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </FrostPanel>
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
    top: 50,
    right: -60,
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
    alignItems: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.cyanDim,
    borderWidth: 1.5,
    borderColor: Colors.electricCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  formPanel: {
    padding: Spacing.xl,
  },
  countryCode: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  otpLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginBottom: Spacing.base,
    fontWeight: '500',
  },
  otpRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  otpInput: {
    width: 44,
    height: 52,
    borderRadius: Radius.input,
    borderWidth: 1.5,
    borderColor: Colors.frostBorder,
    backgroundColor: Colors.frostLight,
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: Colors.electricCyan,
    backgroundColor: Colors.cyanDim,
  },
  verifyButton: {
    marginBottom: Spacing.base,
  },
  resendRow: {
    alignItems: 'center',
  },
  resendTimer: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  resendLink: {
    color: Colors.electricCyan,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
});
