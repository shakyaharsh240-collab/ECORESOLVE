/**
 * EcoResolve — Marketplace Screen (Phase 2)
 * Live waste listings · Startup stores · Search + filter
 */

import React, { useState, useMemo } from 'react';
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
import { MagnifyingGlass, Robot, SlidersHorizontal, ArrowRight, X } from 'phosphor-react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants';
import { FrostPanel, DriftWidget, GlowButton, SkeletonCard } from '../../components/ui';
import { useUIStore } from '../../stores/ui.store';
import { useWasteListings, useStores } from '../../hooks/useMarketplace';
import { WasteType, WasteListing, StartupStore } from '../../constants/types';

type MarketTab = 'waste' | 'stores' | 'products';

const WASTE_TYPE_COLORS: Record<WasteType, string> = {
  plastic: '#00F2FF',
  paper: '#FFB800',
  metal: '#C0C0C0',
  glass: '#7000FF',
  ewaste: '#FF3B5C',
  organic: '#00FF9D',
};

const WASTE_TYPE_ICONS: Record<WasteType, string> = {
  plastic: '🧴',
  paper: '📄',
  metal: '🔩',
  glass: '🫙',
  ewaste: '💻',
  organic: '🌿',
};

const ALL_WASTE_TYPES = Object.keys(WASTE_TYPE_ICONS) as WasteType[];

export default function MarketplaceScreen() {
  const insets = useSafeAreaInsets();
  const { openAIAssistant } = useUIStore();

  const [activeTab, setActiveTab] = useState<MarketTab>('waste');
  const [selectedType, setSelectedType] = useState<WasteType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { listings, loading: listingsLoading } = useWasteListings(selectedType ?? undefined);
  const { stores, loading: storesLoading } = useStores();

  const filteredListings = useMemo(() => {
    if (!searchQuery.trim()) return listings;
    const q = searchQuery.toLowerCase();
    return listings.filter(
      (l) =>
        l.type.includes(q) ||
        l.locationAddress?.toLowerCase().includes(q) ||
        l.condition.includes(q)
    );
  }, [listings, searchQuery]);

  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return stores;
    const q = searchQuery.toLowerCase();
    return stores.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.categories.some((c) => c.toLowerCase().includes(q))
    );
  }, [stores, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setRefreshing(false);
  };

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
                placeholder={activeTab === 'waste' ? 'Search waste...' : 'Search stores...'}
                placeholderTextColor={Colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                selectionColor={Colors.electricCyan}
              />
              <TouchableOpacity onPress={() => { setShowSearch(false); setSearchQuery(''); }}>
                <X size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.title}>Marketplace</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.iconButton} onPress={() => setShowSearch(true)}>
                  <MagnifyingGlass size={20} color={Colors.textSecondary} weight="regular" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* AI prompt */}
        {!showSearch && (
          <TouchableOpacity style={styles.aiPrompt} onPress={openAIAssistant}>
            <Robot size={18} color={Colors.electricCyan} weight="fill" />
            <Text style={styles.aiPromptText}>What waste should I buy?</Text>
            <ArrowRight size={16} color={Colors.electricCyan} />
          </TouchableOpacity>
        )}

        {/* Tabs */}
        <View style={styles.tabRow}>
          {(['waste', 'stores', 'products'] as MarketTab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'waste' ? '♻️ Waste' : tab === 'stores' ? '🏪 Stores' : '🛍️ Products'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Waste Tab ── */}
        {activeTab === 'waste' && (
          <View style={styles.section}>
            {/* Type filter chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.typeChips}
            >
              <TouchableOpacity
                style={[styles.typeChip, !selectedType && styles.typeChipActive]}
                onPress={() => setSelectedType(null)}
              >
                <Text style={[styles.typeChipText, !selectedType && { color: Colors.electricCyan }]}>
                  All
                </Text>
              </TouchableOpacity>
              {ALL_WASTE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeChip,
                    { borderColor: `${WASTE_TYPE_COLORS[type]}40` },
                    selectedType === type && { backgroundColor: `${WASTE_TYPE_COLORS[type]}15` },
                  ]}
                  onPress={() => setSelectedType(selectedType === type ? null : type)}
                >
                  <Text style={styles.typeChipIcon}>{WASTE_TYPE_ICONS[type]}</Text>
                  <Text style={[styles.typeChipText, { color: WASTE_TYPE_COLORS[type] }]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>
              {listingsLoading ? 'Loading...' :
               `${filteredListings.length} Listing${filteredListings.length !== 1 ? 's' : ''}`}
            </Text>

            {listingsLoading ? (
              <View style={styles.listingsList}>
                {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
              </View>
            ) : filteredListings.length === 0 ? (
              <EmptyState
                emoji="♻️"
                title="No waste listings yet"
                subtitle="Organizers will post waste after drives complete."
              />
            ) : (
              <View style={styles.listingsList}>
                {filteredListings.map((listing, i) => (
                  <WasteListingCard key={listing.id} listing={listing} index={i} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* ── Stores Tab ── */}
        {activeTab === 'stores' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {storesLoading ? 'Loading...' :
               `${filteredStores.length} Verified Store${filteredStores.length !== 1 ? 's' : ''}`}
            </Text>

            {storesLoading ? (
              <View style={styles.listingsList}>
                {[0, 1].map((i) => <SkeletonCard key={i} />)}
              </View>
            ) : filteredStores.length === 0 ? (
              <EmptyState
                emoji="🏪"
                title="No stores yet"
                subtitle="Startup stores will appear here once verified."
              />
            ) : (
              <View style={styles.listingsList}>
                {filteredStores.map((store, i) => (
                  <StoreCard key={store.id} store={store} index={i} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* ── Products Tab ── */}
        {activeTab === 'products' && (
          <View style={styles.section}>
            <EmptyState
              emoji="🛍️"
              title="Coming in Phase 4"
              subtitle="Recycled product listings from startup stores will be available soon."
            />
          </View>
        )}

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function WasteListingCard({ listing, index }: { listing: WasteListing; index: number }) {
  const color = WASTE_TYPE_COLORS[listing.type];
  return (
    <DriftWidget amplitude={3} speed={5200 + index * 500}>
      <TouchableOpacity
        onPress={() => router.push(`/marketplace/waste/${listing.id}`)}
        activeOpacity={0.9}
      >
        <FrostPanel style={styles.listingCard} animate={false}>
          <View style={styles.listingHeader}>
            <View style={[styles.typeBadge, { backgroundColor: `${color}15`, borderColor: `${color}40` }]}>
              <Text style={styles.typeBadgeIcon}>{WASTE_TYPE_ICONS[listing.type]}</Text>
              <Text style={[styles.typeBadgeText, { color }]}>
                {listing.type.toUpperCase()}
              </Text>
            </View>
            <View
              style={[
                styles.conditionBadge,
                {
                  backgroundColor:
                    listing.condition === 'clean' ? `${Colors.success}15` : `${Colors.warning}15`,
                },
              ]}
            >
              <Text
                style={[
                  styles.conditionText,
                  { color: listing.condition === 'clean' ? Colors.success : Colors.warning },
                ]}
              >
                {listing.condition}
              </Text>
            </View>
          </View>

          <View style={styles.listingBody}>
            <View style={styles.listingInfo}>
              <Text style={styles.listingQuantity}>{listing.quantity} kg</Text>
              {listing.locationAddress && (
                <Text style={styles.listingLocation}>📍 {listing.locationAddress}</Text>
              )}
              <Text style={styles.listingDate}>
                {listing.createdAt instanceof Date
                  ? listing.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                  : ''}
              </Text>
            </View>
            <View style={styles.listingPricing}>
              <Text style={styles.listingPrice}>₹{listing.price}</Text>
              <Text style={styles.listingPriceUnit}>/kg</Text>
              <GlowButton
                label="Buy"
                onPress={() => router.push(`/marketplace/waste/${listing.id}`)}
                size="sm"
                style={styles.buyButton}
              />
            </View>
          </View>
        </FrostPanel>
      </TouchableOpacity>
    </DriftWidget>
  );
}

function StoreCard({ store, index }: { store: StartupStore; index: number }) {
  return (
    <DriftWidget amplitude={3} speed={5000 + index * 700}>
      <TouchableOpacity
        onPress={() => router.push(`/marketplace/store/${store.id}`)}
        activeOpacity={0.9}
      >
        <FrostPanel style={styles.storeCard} animate={false}>
          <View style={styles.storeHeader}>
            <View style={styles.storeLogo}>
              <Text style={styles.storeLogoText}>
                {store.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.storeInfo}>
              <View style={styles.storeNameRow}>
                <Text style={styles.storeName}>{store.name}</Text>
                {store.verified && (
                  <Text style={styles.verifiedBadge}>✓ Verified</Text>
                )}
              </View>
              <Text style={styles.storeDescription} numberOfLines={2}>
                {store.description}
              </Text>
              <Text style={styles.storeTier}>
                {store.subscriptionTier.charAt(0).toUpperCase() + store.subscriptionTier.slice(1)} Plan
              </Text>
            </View>
          </View>
          {store.categories.length > 0 && (
            <View style={styles.categoryRow}>
              {store.categories.slice(0, 4).map((cat) => (
                <View key={cat} style={styles.categoryChip}>
                  <Text style={styles.categoryChipText}>{cat}</Text>
                </View>
              ))}
            </View>
          )}
        </FrostPanel>
      </TouchableOpacity>
    </DriftWidget>
  );
}

function EmptyState({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <FrostPanel style={styles.emptyState} animate={false}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </FrostPanel>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.voidBlack },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: Spacing.base, marginBottom: Spacing.base,
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
  headerActions: { flexDirection: 'row', gap: Spacing.sm },
  iconButton: {
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
  aiPromptText: { color: Colors.electricCyan, fontSize: FontSize.sm, fontWeight: FontWeight.medium, flex: 1 },

  tabRow: {
    flexDirection: 'row', backgroundColor: Colors.frostLight,
    borderRadius: Radius.pill, padding: 3, marginBottom: Spacing.xl,
  },
  tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: Radius.pill },
  tabActive: { backgroundColor: Colors.electricCyan },
  tabText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textMuted },
  tabTextActive: { color: Colors.voidBlack },

  section: { marginBottom: Spacing.xl },
  sectionTitle: {
    fontSize: FontSize.md, fontWeight: FontWeight.bold,
    color: Colors.textPrimary, marginBottom: Spacing.base,
  },

  typeChips: { gap: Spacing.sm, paddingBottom: Spacing.base, marginBottom: Spacing.base },
  typeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: Radius.pill, borderWidth: 1,
    borderColor: Colors.frostBorder, backgroundColor: Colors.frostLight,
  },
  typeChipActive: { backgroundColor: Colors.cyanDim, borderColor: Colors.electricCyan },
  typeChipIcon: { fontSize: 14 },
  typeChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, color: Colors.textMuted },

  listingsList: { gap: Spacing.base },
  listingCard: { padding: Spacing.base, borderRadius: Radius.widget },
  listingHeader: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  typeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
    borderRadius: Radius.pill, borderWidth: 1,
  },
  typeBadgeIcon: { fontSize: 12 },
  typeBadgeText: { fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.5 },
  conditionBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.pill },
  conditionText: { fontSize: 10, fontWeight: FontWeight.semibold, textTransform: 'capitalize' },
  listingBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  listingInfo: { flex: 1, gap: 3 },
  listingQuantity: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
  listingLocation: { fontSize: FontSize.xs, color: Colors.textMuted },
  listingDate: { fontSize: FontSize.xs, color: Colors.textMuted },
  listingPricing: { alignItems: 'flex-end', gap: Spacing.xs },
  listingPrice: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.electricCyan },
  listingPriceUnit: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: -Spacing.sm },
  buyButton: { marginTop: Spacing.xs },

  storeCard: { padding: Spacing.base, borderRadius: Radius.widget },
  storeHeader: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  storeLogo: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.frostMid, borderWidth: 1, borderColor: Colors.frostBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  storeLogoText: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.electricCyan },
  storeInfo: { flex: 1, gap: 3 },
  storeNameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  storeName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  verifiedBadge: { fontSize: FontSize.xs, color: Colors.success, fontWeight: FontWeight.semibold },
  storeDescription: { fontSize: FontSize.xs, color: Colors.textSecondary },
  storeTier: { fontSize: FontSize.xs, color: Colors.neonPurple, fontWeight: FontWeight.medium },
  categoryRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  categoryChip: {
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
    borderRadius: Radius.pill, backgroundColor: Colors.frostMid,
    borderWidth: 1, borderColor: Colors.frostBorder,
  },
  categoryChipText: { fontSize: FontSize.xs, color: Colors.textSecondary },

  emptyState: {
    padding: Spacing.xxl, borderRadius: Radius.widget,
    alignItems: 'center', gap: Spacing.md,
  },
  emptyEmoji: { fontSize: 44 },
  emptyTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});
