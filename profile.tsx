/**
 * EcoResolve — Profile Screen
 * User info · Token wallet · Role switcher · Badges · Settings
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Gear,
  SignOut,
  Robot,
  Shield,
  Bell,
  ChartBar,
  Leaf,
  Buildings,
  Storefront,
  CaretRight,
} from 'phosphor-react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadows } from '../../constants';
import {
  FrostPanel,
  DriftWidget,
  TokenPulseOrb,
  ProgressArc,
  GlowButton,
} from '../../components/ui';
import { useAuthStore } from '../../stores/auth.store';
import { useUIStore } from '../../stores/ui.store';
import { signOutUser } from '../../services/auth.service';
import { UserRole } from '../../constants/types';

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  volunteer: <Leaf size={16} color={Colors.success} weight="fill" />,
  organizer: <Buildings size={16} color={Colors.electricCyan} weight="fill" />,
  startup: <Storefront size={16} color={Colors.neonPurple} weight="fill" />,
};

const ROLE_COLORS: Record<UserRole, string> = {
  volunteer: Colors.success,
  organizer: Colors.electricCyan,
  startup: Colors.neonPurple,
};

const MOCK_BADGES = [
  { id: 'b1', emoji: '🌱', name: 'First Drive', unlocked: true },
  { id: 'b2', emoji: '♻️', name: '10 Drives', unlocked: false },
  { id: 'b3', emoji: '🔥', name: '7-Day Streak', unlocked: false },
  { id: 'b4', emoji: '⚡', name: '100 kg', unlocked: false },
  { id: 'b5', emoji: '🏆', name: 'Top 10', unlocked: false },
  { id: 'b6', emoji: '🌍', name: 'Eco Hero', unlocked: false },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, setActiveRole, logout } = useAuthStore();
  const { openAIAssistant, showToast } = useUIStore();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOutUser();
              logout();
              router.replace('/(auth)/welcome');
            } catch {
              showToast('Failed to sign out.', 'error');
            }
          },
        },
      ]
    );
  };

  const handleRoleSwitch = (role: UserRole) => {
    if (!user?.roles.includes(role)) return;
    setActiveRole(role);
    showToast(`Switched to ${role} mode`, 'success');
  };

  const totalTokens = (user?.tokens ?? 0) + (user?.releasedTokens ?? 0);
  const escrowPct = totalTokens > 0 ? (user?.tokens ?? 0) / totalTokens : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Gear size={22} color={Colors.textSecondary} weight="regular" />
          </TouchableOpacity>
        </View>

        {/* Profile card */}
        <DriftWidget amplitude={4} speed={7000}>
          <FrostPanel style={styles.profileCard} animate>
            <View style={styles.profileTop}>
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                {user?.photoURL ? (
                  <Image source={{ uri: user.photoURL }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarInitial}>
                      {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                    </Text>
                  </View>
                )}
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{user?.rank ?? '—'}</Text>
                </View>
              </View>

              {/* Info */}
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name ?? 'Eco Hero'}</Text>
                <Text style={styles.profileEmail}>{user?.email ?? ''}</Text>

                {/* Active role */}
                {user?.activeRole && (
                  <View
                    style={[
                      styles.activeRoleBadge,
                      { borderColor: `${ROLE_COLORS[user.activeRole]}40` },
                    ]}
                  >
                    {ROLE_ICONS[user.activeRole]}
                    <Text
                      style={[
                        styles.activeRoleText,
                        { color: ROLE_COLORS[user.activeRole] },
                      ]}
                    >
                      {user.activeRole.charAt(0).toUpperCase() + user.activeRole.slice(1)}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Role switcher */}
            {(user?.roles?.length ?? 0) > 1 && (
              <View style={styles.roleSwitcher}>
                <Text style={styles.roleSwitcherLabel}>Switch Role</Text>
                <View style={styles.roleButtons}>
                  {user?.roles.map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.roleButton,
                        user.activeRole === role && {
                          backgroundColor: `${ROLE_COLORS[role]}20`,
                          borderColor: ROLE_COLORS[role],
                        },
                      ]}
                      onPress={() => handleRoleSwitch(role)}
                    >
                      {ROLE_ICONS[role]}
                      <Text
                        style={[
                          styles.roleButtonText,
                          user.activeRole === role && { color: ROLE_COLORS[role] },
                        ]}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </FrostPanel>
        </DriftWidget>

        {/* Token wallet */}
        <Text style={styles.sectionTitle}>Token Wallet</Text>
        <DriftWidget amplitude={3} speed={6500}>
          <FrostPanel style={styles.walletCard} animate={false}>
            <View style={styles.walletTop}>
              <TokenPulseOrb balance={user?.tokens ?? 0} size={80} />
              <View style={styles.walletInfo}>
                <View style={styles.walletRow}>
                  <View style={styles.walletDot} />
                  <Text style={styles.walletLabel}>Locked (Escrow)</Text>
                  <Text style={styles.walletValue}>{user?.tokens ?? 0} ECT</Text>
                </View>
                <View style={styles.walletRow}>
                  <View style={[styles.walletDot, { backgroundColor: Colors.success }]} />
                  <Text style={styles.walletLabel}>Released</Text>
                  <Text style={[styles.walletValue, { color: Colors.success }]}>
                    {user?.releasedTokens ?? 0} ECT
                  </Text>
                </View>
                <View style={styles.walletDivider} />
                <View style={styles.walletRow}>
                  <Text style={[styles.walletLabel, { fontWeight: FontWeight.bold }]}>
                    Total
                  </Text>
                  <Text style={[styles.walletValue, { color: Colors.electricCyan, fontWeight: FontWeight.bold }]}>
                    {totalTokens} ECT
                  </Text>
                </View>
              </View>
            </View>

            {/* Escrow progress */}
            <View style={styles.escrowProgress}>
              <Text style={styles.escrowLabel}>
                Tokens release when waste is sold
              </Text>
              <ProgressArc
                progress={1 - escrowPct}
                size={48}
                strokeWidth={3}
                color={Colors.success}
                label={`${Math.round((1 - escrowPct) * 100)}%`}
              />
            </View>

            <TouchableOpacity style={styles.aiWalletPrompt} onPress={openAIAssistant}>
              <Robot size={14} color={Colors.electricCyan} weight="fill" />
              <Text style={styles.aiWalletText}>How do I earn more tokens?</Text>
            </TouchableOpacity>
          </FrostPanel>
        </DriftWidget>

        {/* Badges */}
        <Text style={styles.sectionTitle}>Badges</Text>
        <View style={styles.badgesGrid}>
          {MOCK_BADGES.map((badge) => (
            <View
              key={badge.id}
              style={[
                styles.badgeItem,
                !badge.unlocked && styles.badgeLocked,
              ]}
            >
              <Text style={[styles.badgeEmoji, !badge.unlocked && styles.badgeEmojiLocked]}>
                {badge.emoji}
              </Text>
              <Text style={[styles.badgeName, !badge.unlocked && styles.badgeNameLocked]}>
                {badge.name}
              </Text>
            </View>
          ))}
        </View>

        {/* Menu items */}
        <Text style={styles.sectionTitle}>Account</Text>
        <FrostPanel style={styles.menuCard} animate={false}>
          {[
            { icon: <ChartBar size={18} color={Colors.electricCyan} />, label: 'My Analytics', onPress: () => {} },
            { icon: <Bell size={18} color={Colors.electricCyan} />, label: 'Notifications', onPress: () => {} },
            { icon: <Shield size={18} color={Colors.electricCyan} />, label: 'Privacy & Security', onPress: () => {} },
            { icon: <Robot size={18} color={Colors.electricCyan} />, label: 'AI Assistant', onPress: openAIAssistant },
          ].map((item, i, arr) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                i < arr.length - 1 && styles.menuItemBorder,
              ]}
              onPress={item.onPress}
            >
              {item.icon}
              <Text style={styles.menuLabel}>{item.label}</Text>
              <CaretRight size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </FrostPanel>

        {/* Sign out */}
        <GlowButton
          label="Sign Out"
          onPress={handleSignOut}
          variant="ghost"
          fullWidth
          style={styles.signOutButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    marginBottom: Spacing.base,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.frostLight,
    borderWidth: 1,
    borderColor: Colors.frostBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    padding: Spacing.xl,
    borderRadius: Radius.panel,
    marginBottom: Spacing.xl,
  },
  profileTop: {
    flexDirection: 'row',
    gap: Spacing.base,
    marginBottom: Spacing.base,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: Colors.electricCyan,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.cyanDim,
    borderWidth: 2,
    borderColor: Colors.electricCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.electricCyan,
  },
  rankBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.neonPurple,
    borderRadius: Radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1.5,
    borderColor: Colors.voidBlack,
  },
  rankText: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  profileInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  profileName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  profileEmail: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  activeRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    borderWidth: 1,
    backgroundColor: Colors.frostLight,
    marginTop: Spacing.xs,
  },
  activeRoleText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  roleSwitcher: {
    borderTopWidth: 1,
    borderTopColor: Colors.frostBorder,
    paddingTop: Spacing.base,
    gap: Spacing.sm,
  },
  roleSwitcherLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.frostBorder,
    backgroundColor: Colors.frostLight,
  },
  roleButtonText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
  },
  walletCard: {
    padding: Spacing.xl,
    borderRadius: Radius.widget,
    marginBottom: Spacing.xl,
    gap: Spacing.base,
  },
  walletTop: {
    flexDirection: 'row',
    gap: Spacing.xl,
    alignItems: 'center',
  },
  walletInfo: {
    flex: 1,
    gap: Spacing.sm,
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  walletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.electricCyan,
  },
  walletLabel: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  walletValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  walletDivider: {
    height: 1,
    backgroundColor: Colors.frostBorder,
  },
  escrowProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.frostBorder,
    paddingTop: Spacing.base,
  },
  escrowLabel: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  aiWalletPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  aiWalletText: {
    fontSize: FontSize.xs,
    color: Colors.electricCyan,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  badgeItem: {
    width: (Dimensions_width - Spacing.xl * 2 - Spacing.md * 5) / 6,
    alignItems: 'center',
    gap: 4,
  },
  badgeLocked: {
    opacity: 0.35,
  },
  badgeEmoji: {
    fontSize: 28,
  },
  badgeEmojiLocked: {
    filter: 'grayscale(100%)',
  },
  badgeName: {
    fontSize: 9,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: Colors.textMuted,
  },
  menuCard: {
    borderRadius: Radius.widget,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.base,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.frostBorder,
  },
  menuLabel: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  signOutButton: {
    marginBottom: Spacing.xl,
  },
});

// Need to import Dimensions for badge grid calculation
import { Dimensions } from 'react-native';
const Dimensions_width = Dimensions.get('window').width;
