/**
 * EcoResolve — Drives Hooks
 * Real-time Firestore subscriptions via React Query + custom hooks.
 */

import { useEffect, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  subscribeToDrives,
  subscribeToDrive,
  subscribeToOrganizerDrives,
  subscribeToPlatformStats,
  joinDrive,
  leaveDrive,
  createDrive,
  updateDriveStatus,
  getPlatformStats,
  CreateDriveInput,
  PlatformStats,
} from '../services/drives.service';
import { Drive, DriveStatus } from '../constants/types';
import { useAuthStore } from '../stores/auth.store';

// ── Real-time drives list ─────────────────────────────────────────────────────

export function useLiveDrives(statusFilter?: DriveStatus[]) {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToDrives((data) => {
      setDrives(data);
      setLoading(false);
    }, statusFilter);
    return unsub;
  }, [JSON.stringify(statusFilter)]);

  return { drives, loading, error };
}

// ── Single drive (real-time) ──────────────────────────────────────────────────

export function useLiveDrive(driveId: string | null) {
  const [drive, setDrive] = useState<Drive | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!driveId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeToDrive(driveId, (data) => {
      setDrive(data);
      setLoading(false);
    });
    return unsub;
  }, [driveId]);

  return { drive, loading };
}

// ── Organizer's drives ────────────────────────────────────────────────────────

export function useOrganizerDrives(organizerId: string | null) {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organizerId) {
      setLoading(false);
      return;
    }
    const unsub = subscribeToOrganizerDrives(organizerId, (data) => {
      setDrives(data);
      setLoading(false);
    });
    return unsub;
  }, [organizerId]);

  return { drives, loading };
}

// ── Platform stats (real-time) ────────────────────────────────────────────────

export function usePlatformStats() {
  const [stats, setStats] = useState<PlatformStats>({
    totalKgCollected: 0,
    tokensDistributed: 0,
    drivesCompleted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToPlatformStats((data) => {
      setStats(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { stats, loading };
}

// ── Join / Leave drive ────────────────────────────────────────────────────────

export function useJoinDrive() {
  const { user } = useAuthStore();

  const join = useCallback(
    async (driveId: string) => {
      if (!user) throw new Error('Not authenticated');
      await joinDrive(driveId, user.uid);
    },
    [user]
  );

  const leave = useCallback(
    async (driveId: string) => {
      if (!user) throw new Error('Not authenticated');
      await leaveDrive(driveId, user.uid);
    },
    [user]
  );

  const hasJoined = useCallback(
    (drive: Drive) => {
      if (!user) return false;
      return drive.volunteersJoined.includes(user.uid);
    },
    [user]
  );

  return { join, leave, hasJoined };
}

// ── Create drive ──────────────────────────────────────────────────────────────

export function useCreateDrive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDriveInput) => createDrive(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drives'] });
    },
  });
}

// ── Nearby drives (client-side distance filter) ───────────────────────────────

export function useNearbyDrives(
  userLat: number | null,
  userLng: number | null,
  radiusKm = 10
) {
  const { drives, loading } = useLiveDrives(['upcoming', 'active']);

  const nearbyDrives = drives
    .map((drive) => {
      if (!userLat || !userLng) return { ...drive, distanceKm: 999 };
      const distanceKm = haversineDistance(
        userLat,
        userLng,
        drive.location.latitude,
        drive.location.longitude
      );
      return { ...drive, distanceKm };
    })
    .filter((d) => d.distanceKm <= radiusKm)
    .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));

  return { drives: nearbyDrives, loading };
}

// ── Haversine distance formula ────────────────────────────────────────────────

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}
