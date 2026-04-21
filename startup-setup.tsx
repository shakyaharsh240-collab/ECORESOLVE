/**
 * EcoResolve — Startup Onboarding Screen
 * Phase 4 feature — placeholder
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'phosphor-react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants';
import { FrostPanel, GlowButton } from '../../components/ui';

export default function StartupSetupScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Startup Setup</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <FrostPanel style={styles.card} animate>
          <Text style={styles.emoji}>🚀</Text>
          <Text style={styles.cardTitle}>Coming in Phase 4</Text>
          <Text style={styles.cardText}>
            Startup store setup with Stripe subscription and product management will be available soon.
          </Text>
          <GlowButton label="Close" onPress={() => router.back()} variant="ghost" />
        </FrostPanel>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.voidBlack },
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
  content: { flex: 1, padding: Spacing.xl, justifyContent: 'center' },
  card: { padding: Spacing.xxl, borderRadius: Radius.panel, alignItems: 'center', gap: Spacing.base },
  emoji: { fontSize: 48 },
  cardTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  cardText: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
