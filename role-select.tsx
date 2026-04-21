/**
 * EcoResolve — Role Selection Screen
 * Multi-select: Volunteer / Organizer / Startup
 * Animated role cards with haptic feedback.
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Leaf, Buildings, Storefront, CheckCircle } from 'phosphor-react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadows } from '../../constants';
import { GlowButton, FrostPanel, CyanOrb, DriftWidget } from '../../components/ui';
import { updateUserRoles } from '../../services/auth.service';
import { useAuthStore } from '../../stores/auth.store';
import { useUIStore } from '../../stores/ui.store';
import { UserRole } from '../../constants/types';
import { useHaptic } from '../../hooks/useHaptic';

interface RoleCard {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  perks: string[];
}

const ROLES: RoleCard[] = [
  {
    role: 'volunteer',
    title: 'Volunteer',
    description: 'Join cleanup drives, collect waste, and earn ECT tokens.',
    icon: <Leaf size={32} weight="fill" color={Colors.success} />,
    color: Colors.success,
    perks: ['Earn tokens per kg collected', 'Join local drives', 'Build eco impact score'],
  },
  {
    role: 'organizer',
    title: 'Organizer',
    description: 'Create and manage cleanup drives. Upload and sell collected waste.',
    icon: <Buildings size={32} weight="fill" color={Colors.electricCyan} />,
    color: Colors.electricCyan,
    perks: ['Create drives', 'Upload waste listings', 'Track earnings'],
  },
  {
    role: 'startup',
    title: 'Startup',
    description: 'Buy verified waste materials and sell recycled products.',
    icon: <Storefront size={32} weight="fill" color={Colors.neonPurple} />,
    color: Colors.neonPurple,
    perks: ['Buy verified waste', 'Open your store', 'Access analytics'],
  },
];

export default function RoleSelectScreen() {
  const insets = useSafeAreaInsets();
  const { user, setUser } = useAuthStore();
  const { showToast } = useUIStore();
  const haptic = useHaptic();

  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(false);

  // Staggered entrance animations
  const cardOpacities = ROLES.map(() => useSharedValue(0));
  const cardTranslates = ROLES.map(() => useSharedValue(40));

  useEffect(() => {
    ROLES.forEach((_, i) => {
      cardOpacities[i].value = withDelay(300 + i * 120, withTiming(1, { duration: 500 }));
      cardTranslates[i].value = withDelay(
        300 + i * 120,
        withSpring(0, { mass: 0.7, damping: 16, stiffness: 180 })
      );
    });
  }, []);

  const toggleRole = (role: UserRole) => {
    haptic.selection();
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleContinue = async () => {
    if (selectedRoles.length === 0) {
      showToast('Select at least one role to continue.', 'warning');
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      await updateUserRoles(user.uid, selectedRoles);
      // Update local store
      setUser({ ...user, roles: selectedRoles, activeRole: selectedRoles[0] });
      haptic.success();
      router.replace('/(tabs)');
    } catch {
      showToast('Failed to save roles. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <CyanOrb size={350} opacity={0.06} style={styles.bgOrb} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Choose your role</Text>
        <Text style={styles.subtitle}>
          You can select multiple roles. Switch anytime from your profile.
        </Text>
      </View>

      {/* Role cards */}
      <View style={styles.cardsContainer}>
        {ROLES.map((roleCard, index) => {
          const isSelected = selectedRoles.includes(roleCard.role);

          const cardStyle = useAnimatedStyle(() => ({
            opacity: cardOpacities[index].value,
            transform: [{ translateY: cardTranslates[index].value }],
          }));

          return (
            <Animated.View key={roleCard.role} style={cardStyle}>
              <DriftWidget amplitude={3} speed={5000 + index * 1000}>
                <TouchableOpacity
                  onPress={() => toggleRole(roleCard.role)}
                  activeOpacity={0.9}
                >
                  <View
                    style={[
                      styles.roleCard,
                      isSelected && {
                        borderColor: roleCard.color,
                        backgroundColor: `${roleCard.color}10`,
                      },
                    ]}
                  >
                    {/* Selected indicator */}
                    {isSelected && (
                      <View style={styles.checkIcon}>
                        <CheckCircle size={22} color={roleCard.color} weight="fill" />
                      </View>
                    )}

                    {/* Icon */}
                    <View
                      style={[
                        styles.roleIcon,
                        { backgroundColor: `${roleCard.color}15` },
                      ]}
                    >
                      {roleCard.icon}
                    </View>

                    {/* Text */}
                    <View style={styles.roleText}>
                      <Text
                        style={[
                          styles.roleTitle,
                          isSelected && { color: roleCard.color },
                        ]}
                      >
                        {roleCard.title}
                      </Text>
                      <Text style={styles.roleDescription}>{roleCard.description}</Text>

                      {/* Perks */}
                      <View style={styles.perksContainer}>
                        {roleCard.perks.map((perk) => (
                          <View key={perk} style={styles.perkRow}>
                            <View
                              style={[
                                styles.perkDot,
                                { backgroundColor: roleCard.color },
                              ]}
                            />
                            <Text style={styles.perkText}>{perk}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </DriftWidget>
            </Animated.View>
          );
        })}
      </View>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        {selectedRoles.length > 0 && (
          <Text style={styles.selectedText}>
            Selected: {selectedRoles.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')}
          </Text>
        )}
        <GlowButton
          label={`Continue${selectedRoles.length > 0 ? ` as ${selectedRoles.length > 1 ? 'Multi-Role' : ROLES.find((r) => r.role === selectedRoles[0])?.title}` : ''}`}
          onPress={handleContinue}
          loading={loading}
          disabled={selectedRoles.length === 0}
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
  bgOrb: {
    position: 'absolute',
    top: -80,
    right: -100,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  cardsContainer: {
    gap: Spacing.base,
    marginBottom: Spacing.xl,
  },
  roleCard: {
    backgroundColor: Colors.frostLight,
    borderWidth: 1.5,
    borderColor: Colors.frostBorder,
    borderRadius: Radius.widget,
    padding: Spacing.xl,
    flexDirection: 'row',
    gap: Spacing.base,
    ...Shadows.z2,
  },
  checkIcon: {
    position: 'absolute',
    top: Spacing.base,
    right: Spacing.base,
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  roleText: {
    flex: 1,
  },
  roleTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  roleDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  perksContainer: {
    gap: Spacing.xs,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  perkDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  perkText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  ctaContainer: {
    gap: Spacing.md,
  },
  selectedText: {
    color: Colors.electricCyan,
    fontSize: FontSize.sm,
    textAlign: 'center',
    fontWeight: FontWeight.medium,
  },
});
