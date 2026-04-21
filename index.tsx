/**
 * EcoResolve — Home Screen (Phase 2)
 * Live Firestore data · Animated stats counters · Nearby drives · AI button
 */

import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, Robot, ArrowRight, Lightning, Plus } from 'phosphor-react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants';
import {
  CyanOrb,
  DriftWidget,
  FrostPanel,
  SkeletonCard,
  TokenPulseOrb,
  GlowButton,
  AnimatedCounter,
} from '../../components/ui';
import { DriveCard } from '../../components/cards';
import { useAuthStore } from '../../stores/auth.store';
import { useUIStore } from '../../stores/ui.store';
import { useLiveDrives, usePlatformStats } from '../../hooks/useDrives';
import { useLocation } from '../../hooks/useLocation';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { openAIAssistant } = useUIStore();
  const [refreshing, setRefreshing] = React.useState(false);

  // Live data
  const { drives, loading: drivesLoading } = useLiveDrives(['upcoming', 'active']);
  const { stats, loading: statsLoading } = usePlatformStats();
  const { latitude, longitude } = useLocation();

  // Sort drives by distance if location available, else by status (active first)
  const sortedDrives = React.useMemo(() => {
    return [...drives]
      .map((d) => {
        if (latitude && longitude && d.location.latitude && d.location.longitude) {
          const dist = haversine(latitude, longitude, d.location.latitude, d.location.longitude);
          return { ...d, distanceKm: parseFloat(dist.toFixed(1)) };
        }
        return d;
      })
      .sort((a, b) => {
        // Active drives first
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (b.status === 'active' && a.status !== 'active') return 1;
        // Then by distance
        return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
      })
      .slice(0, 6);
  }, [drives, latitude, longitude]);

  const urgentDrive = sortedDrives.find(
    (d) => d.status === 'active' && d.volunteersJoined.length < d.volunteersNeeded
  );

  // Entrance animations
  const heroOpacity = useSharedValue(0);
  const heroY = useSharedValue(30);
  const statsOpacity = useSharedValue(0);
  const drivesOpacity = useSharedValue(0);
  const orbPulse = useSharedValue(1);

  useEffect(() => {
    heroOpacity.value = withDelay(100, withTiming(1, { duration: 600 }));
    heroY.value = withDelay(100, withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }));
    statsOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    drivesOpacity.value = withDelay(700, withTiming(1, { duration: 500 }));
    orbPulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroY.value }],
  }));
  const statsStyle = useAnimatedStyle(() => ({ opacity: statsOpacity.value }));
  const drivesStyle = useAnimatedStyle(() => ({ opacity: drivesOpacity.value }));
  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbPulse.value }],
  }));

  const onRefresh = async () => {
    setRefreshing(true);
    // Firestore listeners auto-refresh; just wait briefly for UX
    await new Promise((r) => setTimeout(r, 800));
    setRefreshing(false);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const isOrganizer = user?.roles?.includes('organizer');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Ambient background */}
      <CyanOrb size={500} opacity={0.05} style={styles.bgOrb1} duration={35000} />
      <CyanOrb size={300} color={Colors.neonPurple} opacity={0.04} style={styles.bgOrb2} duration={22000} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.electricCyan}
            colors={[Colors.electricCyan]}
          />
        }
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.userName}>
              {user?.name?.split(' ')[0] ?? 'Eco Hero'} 🌱
            </Text>
          </View>
          <View style={styles.topBarActions}>
            {isOrganizer && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push('/drives/create')}
              >
                <Plus size={20} color={Colors.electricCyan} weight="bold" />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={22} color={Colors.textSecondary} weight="regular" />
            </TouchableOpacity>
            <TokenPulseOrb balance={user?.tokens ?? 0} size={44} label="ECT" />
          </View>
        </View>

        {/* Hero */}
        <Animated.View style={[styles.heroSection, heroStyle]}>
          <DriftWidget amplitude={6} speed={6000}>
            <Animated.View style={[styles.heroOrb, orbStyle]}>
              <Text style={styles.heroEmoji}>♻️</Text>
            </Animated.View>
          </DriftWidget>
          <Text style={styles.heroTitle}>Turn Waste{'\n'}Into Worth</Text>
          <Text style={styles.heroSubtitle}>
            Join a drive near you and start earning ECT tokens today
          </Text>
          <GlowButton
            label="Find Drives Near Me"
            onPress={() => router.push('/(tabs)/community')}
            size="md"
          />
        </Animated.View>

        {/* Impact stats — live counters */}
        <Animated.View style={statsStyle}>
          <Text style={styles.sectionTitle}>Global Impact</Text>
          <View style={styles.statsRow}>
            {statsLoading
              ? [0, 1, 2].map((i) => (
                  <View key={i} style={styles.statCard}>
                    <FrostPanel style={styles.statCardInner} animate={false}>
                      <View style={styles.statSkeleton} />
                      <View style={[styles.statSkeleton, styles.statSkeletonSm]} />
                    </FrostPanel>
                  </View>
                ))
              : [
                  { label: 'Kg Collected', value: stats.totalKgCollected, color: Colors.success },
                  { label: 'Tokens Given', value: stats.tokensDistributed, color: Colors.electricCyan },
                  { label: 'Drives Done', value: stats.drivesCompleted, color: Colors.neonPurple },
                ].map((stat, i) => (
                  <DriftWidget key={stat.label} amplitude={3} speed={5000 + i * 800} style={styles.statCard}>
                    <FrostPanel style={styles.statCardInner} animate={false}>
                      <AnimatedCounter
                        value={stat.value}
                        duration={1400}
                        style={[styles.statValue, { color: stat.color }]}
                        formatter={(n) =>
                          n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toLocaleString()
                        }
                      />
                      <Text style={styles.statLabel}>{stat.label}</Text>
                    </FrostPanel>
                  </DriftWidget>
                ))}
          </View>
        </Animated.View>

        {/* Nearby drives carousel */}
        <Animated.View style={drivesStyle}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {latitude ? 'Nearby Drives' : 'Active Drives'}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/community')}>
              <Text style={styles.seeAll}>
                See all <ArrowRight size={12} color={Colors.electricCyan} />
              </Text>
            </TouchableOpacity>
          </View>

          {drivesLoading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.drivesScroll}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={styles.skeletonCard}>
                  <SkeletonCard />
                </View>
              ))}
            </ScrollView>
          ) : sortedDrives.length === 0 ? (
            <FrostPanel style={styles.emptyDrives} animate={false}>
              <Text style={styles.emptyText}>No drives nearby right now.</Text>
              <Text style={styles.emptySubText}>Check back soon or create one!</Text>
            </FrostPanel>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.drivesScroll}
            >
              {sortedDrives.map((drive, i) => (
                <DriveCard
                  key={drive.id}
                  drive={drive}
                  variant="carousel"
                  driftIndex={i}
                />
              ))}
            </ScrollView>
          )}
        </Animated.View>

        {/* Urgent drive banner */}
        {urgentDrive && (
          <Animated.View style={drivesStyle}>
            <TouchableOpacity
              onPress={() => router.push(`/drives/${urgentDrive.id}`)}
              activeOpacity={0.9}
            >
              <FrostPanel style={styles.urgentBanner} animate={false}>
                <Lightning size={20} color={Colors.warning} weight="fill" />
                <View style={styles.urgentText}>
                  <Text style={styles.urgentTitle}>Drive is LIVE now!</Text>
                  <Text style={styles.urgentSubtitle}>
                    {urgentDrive.title} needs{' '}
                    {urgentDrive.volunteersNeeded - urgentDrive.volunteersJoined.length} more volunteers
                  </Text>
                </View>
                <Text style={styles.urgentCta}>Join →</Text>
              </FrostPanel>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Role-specific quick actions */}
        <Animated.View style={drivesStyle}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {user?.activeRole === 'organizer' && (
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => router.push('/drives/create')}
              >
                <FrostPanel style={styles.quickActionCard} animate={false}>
                  <Text style={styles.quickActionEmoji}>📋</Text>
                  <Text style={styles.quickActionLabel}>Create Drive</Text>
                </FrostPanel>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push('/(tabs)/community')}
            >
              <FrostPanel style={styles.quickActionCard} animate={false}>
                <Text style={styles.quickActionEmoji}>🌍</Text>
                <Text style={styles.quickActionLabel}>Browse Drives</Text>
              </FrostPanel>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push('/(tabs)/marketplace')}
            >
              <FrostPanel style={styles.quickActionCard} animate={false}>
                <Text style={styles.quickActionEmoji}>♻️</Text>
                <Text style={styles.quickActionLabel}>Marketplace</Text>
              </FrostPanel>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={openAIAssistant}
            >
              <FrostPanel style={styles.quickActionCard} animate={false}>
                <Text style={styles.quickActionEmoji}>🤖</Text>
                <Text style={styles.quickActionLabel}>Ask AI</Text>
              </FrostPanel>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* Floating AI button */}
      <TouchableOpacity
        style={[styles.aiButton, { bottom: insets.bottom + 80 }]}
        onPress={openAIAssistant}
      >
        <Robot size={24} color={Colors.voidBlack} weight="fill" />
      </TouchableOpacity>
    </View>
  );
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.voidBlack },
  bgOrb1: { position: 'absolute', top: -100, left: -150 },
  bgOrb2: { position: 'absolute', bottom: 200, right: -100 },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    marginBottom: Spacing.base,
  },
  greeting: { fontSize: FontSize.sm, color: Colors.textMuted },
  userName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  topBarActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.frostLight,
    borderWidth: 1, borderColor: Colors.frostBorder,
    alignItems: 'center', justifyContent: 'center',
  },

  heroSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  heroOrb: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: Colors.cyanDim,
    borderWidth: 2, borderColor: Colors.electricCyan,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xl,
    shadowColor: Colors.electricCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 30, elevation: 10,
  },
  heroEmoji: { fontSize: 56 },
  heroTitle: {
    fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary, textAlign: 'center',
    lineHeight: 44, marginBottom: Spacing.md,
  },
  heroSubtitle: {
    fontSize: FontSize.base, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22,
    marginBottom: Spacing.xl, paddingHorizontal: Spacing.base,
  },

  sectionTitle: {
    fontSize: FontSize.md, fontWeight: FontWeight.bold,
    color: Colors.textPrimary, marginBottom: Spacing.base,
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.base,
  },
  seeAll: { color: Colors.electricCyan, fontSize: FontSize.sm, fontWeight: FontWeight.medium },

  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  statCard: { flex: 1 },
  statCardInner: { padding: Spacing.base, alignItems: 'center', borderRadius: Radius.widget },
  statValue: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold, marginBottom: 2 },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
  statSkeleton: {
    height: 20, width: '70%', borderRadius: 4,
    backgroundColor: Colors.frostMid, marginBottom: 6,
  },
  statSkeletonSm: { height: 12, width: '50%' },

  drivesScroll: { gap: Spacing.md, paddingRight: Spacing.xl, marginBottom: Spacing.xl },
  skeletonCard: { width: 220 },

  emptyDrives: {
    padding: Spacing.xl, borderRadius: Radius.widget,
    alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xl,
  },
  emptyText: { fontSize: FontSize.base, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  emptySubText: { fontSize: FontSize.sm, color: Colors.textMuted },

  urgentBanner: {
    flexDirection: 'row', alignItems: 'center',
    gap: Spacing.md, padding: Spacing.base,
    borderRadius: Radius.widget,
    borderColor: `${Colors.warning}40`,
    marginBottom: Spacing.xl,
  },
  urgentText: { flex: 1 },
  urgentTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.warning },
  urgentSubtitle: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  urgentCta: { color: Colors.warning, fontSize: FontSize.sm, fontWeight: FontWeight.bold },

  quickActions: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: Spacing.sm, marginBottom: Spacing.xl,
  },
  quickAction: { width: (width - Spacing.xl * 2 - Spacing.sm * 3) / 4 },
  quickActionCard: {
    padding: Spacing.sm, borderRadius: Radius.widget,
    alignItems: 'center', gap: Spacing.xs,
  },
  quickActionEmoji: { fontSize: 24 },
  quickActionLabel: {
    fontSize: 10, color: Colors.textSecondary,
    textAlign: 'center', fontWeight: FontWeight.medium,
  },

  bottomPad: { height: Spacing.xl },
  aiButton: {
    position: 'absolute', right: Spacing.xl,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.electricCyan,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.electricCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 20, elevation: 12,
  },
});
