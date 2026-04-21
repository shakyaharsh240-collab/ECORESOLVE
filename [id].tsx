/**
 * EcoResolve — Waste Listing Detail Screen
 */

import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'phosphor-react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../constants';
import { FrostPanel, GlowButton, CyanOrb } from '../../../components/ui';

export default function WasteListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <CyanOrb size={250} opacity={0.05} style={{ position: 'absolute', top: -50, right: -60 }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Waste Listing</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        <FrostPanel style={styles.card} animate>
          <Text style={styles.comingSoonEmoji}>♻️</Text>
          <Text style={styles.title}>Listing #{id}</Text>
          <Text style={styles.subtitle}>
            Full waste listing details and purchase flow coming in Phase 4.
          </Text>
        </FrostPanel>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: insets.bottom + Spacing.base }]}>
        <GlowButton label="Purchase Waste" onPress={() => {}} fullWidth size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.voidBlack },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.frostBorder,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.frostLight,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.base, fontWeight: FontWeight.semibold,
    color: Colors.textPrimary, flex: 1, textAlign: 'center',
  },
  content: { padding: Spacing.xl },
  card: {
    padding: Spacing.xxl, borderRadius: Radius.panel,
    alignItems: 'center', gap: Spacing.base,
  },
  comingSoonEmoji: { fontSize: 48 },
  title: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  cta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.depthLayer,
    borderTopWidth: 1, borderTopColor: Colors.frostBorder,
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.base,
  },
});
