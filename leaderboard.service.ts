/**
 * EcoResolve — Leaderboard & User Stats Service
 */

import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

export interface LeaderboardEntry {
  uid: string;
  name: string;
  photoURL?: string;
  tokens: number;
  releasedTokens: number;
  rank: number;
  drivesJoined: number;
  kgCollected: number;
  badges: string[];
}

export function subscribeToLeaderboard(
  callback: (entries: LeaderboardEntry[]) => void,
  topN = 20
): Unsubscribe {
  const q = query(
    collection(db, 'users'),
    orderBy('releasedTokens', 'desc'),
    limit(topN)
  );

  return onSnapshot(q, (snap) => {
    const entries: LeaderboardEntry[] = snap.docs.map((d, i) => {
      const data = d.data();
      return {
        uid: d.id,
        name: data.name ?? 'Anonymous',
        photoURL: data.photoURL,
        tokens: data.tokens ?? 0,
        releasedTokens: data.releasedTokens ?? 0,
        rank: i + 1,
        drivesJoined: data.drivesJoined ?? 0,
        kgCollected: data.kgCollected ?? 0,
        badges: data.badges ?? [],
      };
    });
    callback(entries);
  });
}
