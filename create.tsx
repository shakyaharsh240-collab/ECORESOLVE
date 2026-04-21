/**
 * EcoResolve — Create Drive Screen (Phase 2 — Organizer)
 * Full form: title, description, date/time, location, targets
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
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, MapPin, Calendar, Clock, Users, Leaf, CurrencyDollar } from 'phosphor-react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants';
import { GlowButton, GlowInput, FrostPanel, CyanOrb } from '../../components/ui';
import { useAuthStore } from '../../stores/auth.store';
import { useUIStore } from '../../stores/ui.store';
import { useCreateDrive } from '../../hooks/useDrives';
import { useHaptic } from '../../hooks/useHaptic';

const createDriveSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(80),
  description: z.string().min(20, 'Description must be at least 20 characters').max(500),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  locationAddress: z.string().min(5, 'Location is required'),
  volunteersNeeded: z.string().refine((v) => parseInt(v) >= 2, 'Need at least 2 volunteers'),
  targetWasteKg: z.string().refine((v) => parseInt(v) >= 1, 'Target must be at least 1 kg'),
  fundGoal: z.string().optional(),
});

type CreateDriveForm = z.infer<typeof createDriveSchema>;

export default function CreateDriveScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { showToast } = useUIStore();
  const haptic = useHaptic();
  const createDriveMutation = useCreateDrive();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateDriveForm>({
    resolver: zodResolver(createDriveSchema),
    defaultValues: {
      volunteersNeeded: '20',
      targetWasteKg: '100',
      fundGoal: '5000',
    },
  });

  const onSubmit = async (data: CreateDriveForm) => {
    if (!user) return;

    try {
      const driveDate = new Date(data.date);

      const driveId = await createDriveMutation.mutateAsync({
        organizerId: user.uid,
        organizerName: user.name,
        organizerPhoto: user.photoURL,
        title: data.title,
        description: data.description,
        date: driveDate,
        time: data.time,
        location: { latitude: 19.076, longitude: 72.8777 }, // Default Mumbai; replace with map picker in Phase 3
        locationAddress: data.locationAddress,
        volunteersNeeded: parseInt(data.volunteersNeeded),
        targetWasteKg: parseInt(data.targetWasteKg),
        fundGoal: parseInt(data.fundGoal ?? '0'),
      });

      haptic.success();
      showToast('Drive created successfully! 🎉', 'success');
      router.replace(`/drives/${driveId}`);
    } catch (err: any) {
      showToast(err.message ?? 'Failed to create drive.', 'error');
      haptic.error();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <CyanOrb size={250} opacity={0.05} style={styles.bgOrb} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Drive</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <X size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Section: Basic Info */}
          <SectionHeader icon="📋" label="Basic Info" />
          <FrostPanel style={styles.formPanel} animate={false}>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <GlowInput
                  label="Drive Title"
                  placeholder="e.g. Juhu Beach Cleanup"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.title?.message}
                  maxLength={80}
                />
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <GlowInput
                  label="Description"
                  placeholder="Describe the drive, what to bring, what to expect..."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.description?.message}
                  multiline
                  numberOfLines={4}
                  style={styles.textArea}
                  maxLength={500}
                />
              )}
            />
          </FrostPanel>

          {/* Section: Date & Time */}
          <SectionHeader icon="📅" label="Date & Time" />
          <FrostPanel style={styles.formPanel} animate={false}>
            <Controller
              control={control}
              name="date"
              render={({ field: { onChange, onBlur, value } }) => (
                <GlowInput
                  label="Date"
                  placeholder="YYYY-MM-DD (e.g. 2025-02-15)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.date?.message}
                  leftIcon={<Calendar size={18} color={Colors.textMuted} />}
                  keyboardType="numbers-and-punctuation"
                />
              )}
            />
            <Controller
              control={control}
              name="time"
              render={({ field: { onChange, onBlur, value } }) => (
                <GlowInput
                  label="Time"
                  placeholder="e.g. 8:00 AM – 12:00 PM"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.time?.message}
                  leftIcon={<Clock size={18} color={Colors.textMuted} />}
                />
              )}
            />
          </FrostPanel>

          {/* Section: Location */}
          <SectionHeader icon="📍" label="Location" />
          <FrostPanel style={styles.formPanel} animate={false}>
            <Controller
              control={control}
              name="locationAddress"
              render={({ field: { onChange, onBlur, value } }) => (
                <GlowInput
                  label="Location Address"
                  placeholder="e.g. Juhu Beach, Mumbai, Maharashtra"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.locationAddress?.message}
                  leftIcon={<MapPin size={18} color={Colors.textMuted} />}
                />
              )}
            />
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>
                🗺️ Map picker coming in Phase 3
              </Text>
            </View>
          </FrostPanel>

          {/* Section: Targets */}
          <SectionHeader icon="🎯" label="Targets" />
          <FrostPanel style={styles.formPanel} animate={false}>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Controller
                  control={control}
                  name="volunteersNeeded"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <GlowInput
                      label="Volunteers Needed"
                      placeholder="20"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.volunteersNeeded?.message}
                      keyboardType="number-pad"
                      leftIcon={<Users size={16} color={Colors.textMuted} />}
                    />
                  )}
                />
              </View>
              <View style={styles.halfField}>
                <Controller
                  control={control}
                  name="targetWasteKg"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <GlowInput
                      label="Target Waste (kg)"
                      placeholder="100"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.targetWasteKg?.message}
                      keyboardType="number-pad"
                      leftIcon={<Leaf size={16} color={Colors.textMuted} />}
                    />
                  )}
                />
              </View>
            </View>
            <Controller
              control={control}
              name="fundGoal"
              render={({ field: { onChange, onBlur, value } }) => (
                <GlowInput
                  label="Fund Goal (₹) — Optional"
                  placeholder="5000"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.fundGoal?.message}
                  keyboardType="number-pad"
                  leftIcon={<CurrencyDollar size={16} color={Colors.textMuted} />}
                />
              )}
            />
          </FrostPanel>

          {/* Tips */}
          <FrostPanel style={styles.tipsCard} animate={false}>
            <Text style={styles.tipsTitle}>💡 Tips for a great drive</Text>
            {[
              'Weekend mornings get 2x more volunteers',
              'Set a realistic waste target (100–200 kg)',
              'Add a clear description with what to bring',
              'Share the drive link after creating',
            ].map((tip) => (
              <View key={tip} style={styles.tipRow}>
                <View style={styles.tipDot} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </FrostPanel>

          {/* Submit */}
          <GlowButton
            label="Create Drive"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting || createDriveMutation.isPending}
            fullWidth
            size="lg"
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

function SectionHeader({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>{icon}</Text>
      <Text style={styles.sectionLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: Colors.voidBlack },
  bgOrb: { position: 'absolute', top: -30, right: -60 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.base,
    borderBottomWidth: 1, borderBottomColor: Colors.frostBorder,
  },
  title: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  closeButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.frostLight, alignItems: 'center', justifyContent: 'center',
  },

  content: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.base },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    marginBottom: Spacing.sm, marginTop: Spacing.base,
  },
  sectionIcon: { fontSize: 18 },
  sectionLabel: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },

  formPanel: { padding: Spacing.base, borderRadius: Radius.widget, marginBottom: Spacing.base },

  textArea: { height: 100, textAlignVertical: 'top', paddingTop: Spacing.sm },

  row: { flexDirection: 'row', gap: Spacing.sm },
  halfField: { flex: 1 },

  mapPlaceholder: {
    height: 80, borderRadius: Radius.input,
    backgroundColor: Colors.frostLight, borderWidth: 1, borderColor: Colors.frostBorder,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  mapPlaceholderText: { fontSize: FontSize.sm, color: Colors.textMuted },

  tipsCard: {
    padding: Spacing.base, borderRadius: Radius.widget,
    marginBottom: Spacing.xl, gap: Spacing.sm,
    borderColor: `${Colors.electricCyan}20`,
  },
  tipsTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.electricCyan },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  tipDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.electricCyan, marginTop: 6 },
  tipText: { flex: 1, fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },
});
