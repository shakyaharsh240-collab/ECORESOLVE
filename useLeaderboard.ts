/**
 * EcoResolve — Leaderboard Hook
 */

import { useEffect, useState } from 'react';
import { subscribeToLeaderboard, LeaderboardEntry } from '../services/leaderboard.service';

export function useLeaderboard(topN = 20) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToLeaderboard((data) => {
      setEntries(data);
      setLoading(false);
    }, topN);
    return unsub;
  }, [topN]);

  return { entries, loading };
}
