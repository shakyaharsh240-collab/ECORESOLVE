/**
 * EcoResolve — DriveCard
 * Reusable drive card used in Home carousel and Community list.
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { MapPin, Users } from 'phosphor-react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants';
import { FrostPanel, DriftWidget, GlowButton } from '../ui';
import { Drive } from '../../constants/types';

interface DriveCardProps {
  drive: Drive;
  variant?: 'carousel' | 'list';
  style?: StyleProp<ViewStyle>;
  driftIndex?: number;
}

export function DriveCard({ drive, variant = 'list', style, driftIndex = 0 }: DriveCardProps) {
  const volunteerPct = drive.volunteersJoined.length / Math.max(drive.volunteersNeeded, 1);
  const isActive = drive.status === 'active';

  return (
    <DriftWidget amplitude={3} speed={5000 + driftIndex * 600} style={style}>
      <TouchableOpacity
        onPress={() => router.push(`/drives/${drive.id}`)}
        activeOpacity={0.9}
      >
        <FrostPanel
          style={[
            styles.card,
            variant === 'carousel' && styles.carouselCard,
            isActive && styles.activeCard,
          ]}
          animate={false}
        >
          {/* Top row: status + distance */}
          <View style={styles.topRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isActive ? `${Colors.success}20` : Colors.cyanDim },
              ]}
            >
              {isActive && <LiveDot />}
              <Text
                style={[
                  styles.statusText,
                  { color: isActive ? Colors.success : Colors.electricCyan },
                ]}
              >
                {isActive ? 'LIVE' : 'UPCOMING'}
              </Text>
            </View>

            {drive.distanceKm !== undefined && (
              <View style={styles.distanceRow}>
                <MapPin size={11} color={Colors.textMuted} />
                <Text style={styles.distanceText}>{drive.distanceKm.toFixed(1)} km</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>{drive.title}</Text>

          {/* Organizer */}
          {drive.organizerName && (
            <Text style={styles.organizer}>by {drive.organizerName}</Text>
          )}

          {/* Date */}
          <Text style={styles.date}>
            📅 {drive.date instanceof Date
              ? drive.date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
              : String(drive.date)}
            {drive.time ? ` · ${drive.time}` : ''}
          </Text>

          {/* Volunteer progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <View style={styles.progressLabelRow}>
                <Users size={12} color={Colors.textMuted} />
                <Text style={styles.progressLabel}>
                  {drive.volunteersJoined.length}/{drive.volunteersNeeded}
                </Text>
              </View>
              <Text style={styles.progressPct}>
                {Math.round(volunteerPct * 100)}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(volunteerPct * 100, 100)}%`,
                    backgroundColor: isActive ? Colors.success : Colors.electricCyan,
                  },
                ]}
              />
            </View>
          </View>

          {/* CTA — list variant only */}
          {variant === 'list' && (
            <GlowButton
              label={isActive ? 'Join Now' : 'View Drive'}
              onPress={() => router.push(`/drives/${drive.id}`)}
              variant={isActive ? 'primary' : 'ghost'}
              size="sm"
              style={styles.cta}
            />
          )}
        </FrostPanel>
      </TouchableOpacity>
    </DriftWidget>
  );
}

function LiveDot() {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success }, style]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.base,
    borderRadius: Radius.widget,
  },
  carouselCard: {
    width: 220,
  },
  activeCard: {
    borderColor: `${Colors.success}40`,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  statusText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  distanceText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  title: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  organizer: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  progressSection: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  progressPct: {
    fontSize: FontSize.xs,
    color: Colors.electricCyan,
    fontWeight: FontWeight.semibold,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.frostBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  cta: {
    alignSelf: 'flex-end',
    marginTop: Spacing.xs,
  },
});
