/**
 * EcoResolve — Auth Hook
 * Bridges Firebase auth state with Zustand store.
 */

import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { onAuthStateChange, getUserDocument } from '../services/auth.service';

export function useAuthListener() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getUserDocument(firebaseUser.uid);
        setUser(userDoc);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);
}

export { useAuthStore };
