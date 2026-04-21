/**
 * EcoResolve — Community Screen (Phase 2)
 * Live Firestore drives · Real-time leaderboard · Join flow with haptics
 */

import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MagnifyingGlass, Robot, Trophy, ArrowRight, X } from 'phosphor-react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants';
import { FrostPanel, SkeletonCard, GlowButton } from '../../components/ui';
import { DriveCard } from '../../components/cards';
import { useUIStore } from '../../stores/ui.store';
import { useAuthStore } from '../../stores/auth.store';
import { useLiveDrives } from '../../hooks/useDrives';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { useLocation } from '../../hooks/useLocation';
import { Drive } from '../../constants/types';

type FilterTab = 'all' | 'nearby' | 'active' | 'upcoming';

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { openAIAssistant } = useUIStore();
  const { user } = useAuthStore();

  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Live data
  const { drives, loading: drivesLoading } = useLiveDrives(['upcoming', 'active']);
  const { entries: leaderboard, loading: lbLoading } = useLeaderboard(10);
  const { latitude, longitude } = useLocation();

  // Enrich drives with distance
  const enrichedDrives: Drive[] = React.useMemo(() => {
    return drives.map((d) => {
      if (latitude && longitude && d.location.latitude) {
        const dist = haversine(latitude, longitude, d.location.latitude, d.location.longitude);
        return { ...d, distanceKm: parseFloat(dist.toFixed(1)) };
      }
      return d;
    });
  }, [drives, latitude, longitude]);

  // Filter + search
  const filteredDrives = React.useMemo(() => {
    let result = enrichedDrives;

    if (activeFilter === 'nearby') result = result.filter((d) => (d.distanceKm ?? 999) <= 5);
    else if (activeFilter === 'active') result = result.filter((d) => d.status === 'active');
    else if (activeFilter === 'upcoming') result = result.filter((d) => d.status === 'upcoming');

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.organizerName?.toLowerCase().includes(q) ||
          d.locationAddress?.toLowerCase().includes(q)
      );
    }

    // Active drives first, then by distance
    return result.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (b.status === 'active' && a.status !== 'active') return 1;
      return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
    });
  }, [enrichedDrives, activeFilter, searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setRefreshing(false);
  }, []);

  // Find current user's rank in leaderboard
  const myRank = leaderboard.findIndex((e) => e.uid === user?.uid);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.electricCyan}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          {showSearch ? (
            <View style={styles.searchBar}>
              <MagnifyingGlass size={16} color={Colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search drives..."
                placeholderTextColor={Colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                selectionColor={Colors.electricCyan}
              />
              <TouchableOpacity
                onPress={() => { setShowSearch(false); setSearchQuery(''); }}
              >
                <X size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.title}>Community</Text>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => setShowSearch(true)}
              >
                <MagnifyingGlass size={20} color={Colors.textSecondary} weight="regular" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* AI quick prompt */}
        {!showSearch && (
          <TouchableOpacity style={styles.aiPrompt} onPress={openAIAssistant}>
            <Robot size={18} color={Colors.electricCyan} weight="fill" />
            <Text style={styles.aiPromptText}>Find a drive near me</Text>
            <ArrowRight size={16} color={Colors.electricCyan} />
          </TouchableOpacity>
        )}

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {(['all', 'nearby', 'active', 'upcoming'] as FilterTab[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, activeFilter === filter && styles.filterTabActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === filter && styles.filterTabTextActive,
                ]}
              >
                {filter === 'all' ? 'All' :
                 filter === 'nearby' ? '📍 Nearby' :
                 filter === 'active' ? '🔴 Live' : '📅 Upcoming'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Drives count */}
        <Text style={styles.sectionTitle}>
          {drivesLoading ? 'Loading drives...' :
           filteredDrives.length === 0 ? 'No drives found' :
           `${filteredDrives.length} Drive${filteredDrives.length !== 1 ? 's' : ''}`}
        </Text>

        {/* Drives list */}
        {drivesLoading ? (
          <View style={styles.drivesList}>
            {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
          </View>
        ) : filteredDrives.length === 0 ? (
          <FrostPanel style={styles.emptyState} animate={false}>
            <Text style={styles.emptyEmoji}>🌍</Text>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No drives match your search' : 'No drives in this filter'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try a different search term' : 'Check back soon or create a drive!'}
            </Text>
            {user?.roles?.includes('organizer') && (
              <GlowButton
                label="Create a Drive"
                onPress={() => router.push('/drives/create')}
                size="sm"
                style={{ marginTop: Spacing.sm }}
              />
            )}
          </FrostPanel>
        ) : (
          <View style={styles.drivesList}>
            {filteredDrives.map((drive, i) => (
              <DriveCard key={drive.id} drive={drive} variant="list" driftIndex={i} />
            ))}
          </View>
        )}

        {/* Leaderboard */}
        <View style={styles.leaderboardSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Trophy size={18} color={Colors.warning} weight="fill" />
              <Text style={styles.sectionTitle}>Leaderboard</Text>
            </View>
          </View>

          <FrostPanel style={styles.leaderboardCard} animate={false}>
            {lbLoading ? (
              [0, 1, 2].map((i) => (
                <View key={i} style={[styles.leaderRow, i < 2 && styles.leaderRowBorder]}>
                  <View style={styles.lbSkeleton} />
                </View>
              ))
            ) : leaderboard.length === 0 ? (
              <View style={styles.leaderRow}>
                <Text style={styles.emptySubtitle}>No data yet — be the first!</Text>
              </View>
            ) : (
              <>
                {leaderboard.slice(0, 5).map((entry, i) => {
                  const isMe = entry.uid === user?.uid;
                  return (
                    <View
                      key={entry.uid}
                      style={[
                        styles.leaderRow,
                        i < Math.min(leaderboard.length, 5) - 1 && styles.leaderRowBorder,
                        isMe && styles.currentUserRow,
                      ]}
                    >
                      <Text style={styles.rankText}>
                        {entry.rank === 1 ? '🥇' :
                         entry.rank === 2 ? '🥈' :
                         entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                      </Text>
                      <View style={styles.leaderAvatarCircle}>
                        <Text style={styles.leaderAvatarText}>
                          {entry.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.leaderInfo}>
                        <Text style={[styles.leaderName, isMe && { color: Colors.electricCyan }]}>
                          {isMe ? 'You' : entry.name}
                        </Text>
                        <Text style={styles.leaderDrives}>{entry.drivesJoined} drives</Text>
                      </View>
                      <Text style={styles.leaderTokens}>
                        {entry.releasedTokens.toLocaleString()} ECT
                      </Text>
                    </View>
                  );
                })}

                {/* Show current user if not in top 5 */}
                {myRank >= 5 && user && (
                  <>
                    <View style={[styles.leaderRow, styles.leaderRowBorder]}>
                      <Text style={[styles.rankText, { color: Colors.textMuted }]}>···</Text>
                    </View>
                    <View style={[styles.leaderRow, styles.currentUserRow]}>
                      <Text style={styles.rankText}>#{myRank + 1}</Text>
                      <View style={styles.leaderAvatarCircle}>
                        <Text style={styles.leaderAvatarText}>
                          {user.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.leaderInfo}>
                        <Text style={[styles.leaderName, { color: Colors.electricCyan }]}>You</Text>
                        <Text style={styles.leaderDrives}>Keep going! 🌱</Text>
                      </View>
                      <Text style={styles.leaderTokens}>
                        {(user.releasedTokens ?? 0).toLocaleString()} ECT
                      </Text>
                    </View>
                  </>
                )}
              </>
            )}
          </FrostPanel>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
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
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: Spacing.base, marginBottom: Spacing.base,
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
  searchButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.frostLight, borderWidth: 1, borderColor: Colors.frostBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.frostLight, borderWidth: 1, borderColor: Colors.electricCyan,
    borderRadius: Radius.input, paddingHorizontal: Spacing.base, height: 44,
  },
  searchInput: { flex: 1, color: Colors.textPrimary, fontSize: FontSize.base },

  aiPrompt: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.cyanDim, borderWidth: 1, borderColor: Colors.electricCyan,
    borderRadius: Radius.pill, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    marginBottom: Spacing.base, alignSelf: 'flex-start',
  },
  aiPromptText: {
    color: Colors.electricCyan, fontSize: FontSize.sm,
    fontWeight: FontWeight.medium, flex: 1,
  },

  filterRow: { gap: Spacing.sm, paddingBottom: Spacing.base, marginBottom: Spacing.base },
  filterTab: {
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.xs,
    borderRadius: Radius.pill, borderWidth: 1,
    borderColor: Colors.frostBorder, backgroundColor: Colors.frostLight,
  },
  filterTabActive: { backgroundColor: Colors.cyanDim, borderColor: Colors.electricCyan },
  filterTabText: { color: Colors.textMuted, fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  filterTabTextActive: { color: Colors.electricCyan },

  sectionTitle: {
    fontSize: FontSize.md, fontWeight: FontWeight.bold,
    color: Colors.textPrimary, marginBottom: Spacing.base,
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.base,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },

  drivesList: { gap: Spacing.base, marginBottom: Spacing.xl },

  emptyState: {
    padding: Spacing.xxl, borderRadius: Radius.widget,
    alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xl,
  },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center' },

  leaderboardSection: { marginBottom: Spacing.xl },
  leaderboardCard: { borderRadius: Radius.widget, overflow: 'hidden' },
  leaderRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: Spacing.md, padding: Spacing.base,
  },
  leaderRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.frostBorder },
  currentUserRow: { backgroundColor: Colors.cyanDim },
  rankText: { fontSize: FontSize.base, width: 32, textAlign: 'center' },
  leaderAvatarCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.frostMid, borderWidth: 1, borderColor: Colors.frostBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  leaderAvatarText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textSecondary },
  leaderInfo: { flex: 1 },
  leaderName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  leaderDrives: { fontSize: FontSize.xs, color: Colors.textMuted },
  leaderTokens: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.electricCyan },
  lbSkeleton: {
    height: 16, width: '100%', borderRadius: 4, backgroundColor: Colors.frostMid,
  },
});
