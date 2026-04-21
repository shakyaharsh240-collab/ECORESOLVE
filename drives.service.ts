/**
 * EcoResolve — Drives Firestore Service
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  Unsubscribe,
  GeoPoint as FirestoreGeoPoint,
} from 'firebase/firestore';
import { db } from './firebase';
import { Drive, DriveStatus, GeoPoint } from '../constants/types';

const DRIVES_COL = 'drives';

// ── Converters ────────────────────────────────────────────────────────────────

function docToDrive(id: string, data: any): Drive {
  return {
    id,
    organizerId: data.organizerId,
    organizerName: data.organizerName,
    organizerPhoto: data.organizerPhoto,
    title: data.title,
    description: data.description,
    date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
    time: data.time,
    location: {
      latitude: data.location?.latitude ?? 0,
      longitude: data.location?.longitude ?? 0,
    },
    locationAddress: data.locationAddress,
    targetWasteKg: data.targetWasteKg ?? 0,
    fundGoal: data.fundGoal ?? 0,
    volunteersNeeded: data.volunteersNeeded ?? 0,
    volunteersJoined: data.volunteersJoined ?? [],
    fundsCollected: data.fundsCollected ?? 0,
    wasteCollected: data.wasteCollected ?? 0,
    status: data.status ?? 'upcoming',
    photos: data.photos ?? [],
    distanceKm: data.distanceKm,
  };
}

// ── Real-time Listeners ───────────────────────────────────────────────────────

/** Subscribe to all active + upcoming drives, ordered by date */
export function subscribeToDrives(
  callback: (drives: Drive[]) => void,
  statusFilter?: DriveStatus[]
): Unsubscribe {
  const statuses = statusFilter ?? ['upcoming', 'active'];
  const q = query(
    collection(db, DRIVES_COL),
    where('status', 'in', statuses),
    orderBy('date', 'asc'),
    limit(50)
  );

  return onSnapshot(q, (snap) => {
    const drives = snap.docs.map((d) => docToDrive(d.id, d.data()));
    callback(drives);
  });
}

/** Subscribe to a single drive by ID */
export function subscribeToDrive(
  driveId: string,
  callback: (drive: Drive | null) => void
): Unsubscribe {
  return onSnapshot(doc(db, DRIVES_COL, driveId), (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }
    callback(docToDrive(snap.id, snap.data()));
  });
}

/** Subscribe to drives created by a specific organizer */
export function subscribeToOrganizerDrives(
  organizerId: string,
  callback: (drives: Drive[]) => void
): Unsubscribe {
  const q = query(
    collection(db, DRIVES_COL),
    where('organizerId', '==', organizerId),
    orderBy('date', 'desc'),
    limit(30)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => docToDrive(d.id, d.data())));
  });
}

// ── One-time Fetches ──────────────────────────────────────────────────────────

export async function getDrive(driveId: string): Promise<Drive | null> {
  const snap = await getDoc(doc(db, DRIVES_COL, driveId));
  if (!snap.exists()) return null;
  return docToDrive(snap.id, snap.data());
}

export async function getActiveDrives(): Promise<Drive[]> {
  const q = query(
    collection(db, DRIVES_COL),
    where('status', 'in', ['upcoming', 'active']),
    orderBy('date', 'asc'),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToDrive(d.id, d.data()));
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export interface CreateDriveInput {
  organizerId: string;
  organizerName: string;
  organizerPhoto?: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: GeoPoint;
  locationAddress: string;
  targetWasteKg: number;
  fundGoal: number;
  volunteersNeeded: number;
}

export async function createDrive(input: CreateDriveInput): Promise<string> {
  const ref = await addDoc(collection(db, DRIVES_COL), {
    ...input,
    location: new FirestoreGeoPoint(input.location.latitude, input.location.longitude),
    volunteersJoined: [],
    fundsCollected: 0,
    wasteCollected: 0,
    status: 'upcoming',
    photos: [],
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function joinDrive(driveId: string, userId: string): Promise<void> {
  await updateDoc(doc(db, DRIVES_COL, driveId), {
    volunteersJoined: arrayUnion(userId),
  });
}

export async function leaveDrive(driveId: string, userId: string): Promise<void> {
  await updateDoc(doc(db, DRIVES_COL, driveId), {
    volunteersJoined: arrayRemove(userId),
  });
}

export async function updateDriveStatus(
  driveId: string,
  status: DriveStatus
): Promise<void> {
  await updateDoc(doc(db, DRIVES_COL, driveId), { status });
}

export async function updateDrive(
  driveId: string,
  data: Partial<Omit<Drive, 'id'>>
): Promise<void> {
  await updateDoc(doc(db, DRIVES_COL, driveId), data);
}

export async function deleteDrive(driveId: string): Promise<void> {
  await deleteDoc(doc(db, DRIVES_COL, driveId));
}

// ── Platform Stats ────────────────────────────────────────────────────────────

export interface PlatformStats {
  totalKgCollected: number;
  tokensDistributed: number;
  drivesCompleted: number;
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const snap = await getDoc(doc(db, 'platform', 'stats'));
  if (!snap.exists()) {
    return { totalKgCollected: 0, tokensDistributed: 0, drivesCompleted: 0 };
  }
  const d = snap.data();
  return {
    totalKgCollected: d.totalKgCollected ?? 0,
    tokensDistributed: d.tokensDistributed ?? 0,
    drivesCompleted: d.drivesCompleted ?? 0,
  };
}

export function subscribeToPlatformStats(
  callback: (stats: PlatformStats) => void
): Unsubscribe {
  return onSnapshot(doc(db, 'platform', 'stats'), (snap) => {
    if (!snap.exists()) {
      callback({ totalKgCollected: 0, tokensDistributed: 0, drivesCompleted: 0 });
      return;
    }
    const d = snap.data();
    callback({
      totalKgCollected: d.totalKgCollected ?? 0,
      tokensDistributed: d.tokensDistributed ?? 0,
      drivesCompleted: d.drivesCompleted ?? 0,
    });
  });
}
