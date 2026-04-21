/**
 * EcoResolve — Location Hook
 * Requests foreground location permission and returns current coords.
 */

import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
}

export function useLocation(): LocationState {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    loading: true,
    error: null,
    permissionGranted: false,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (!cancelled) {
            setState((s) => ({
              ...s,
              loading: false,
              error: 'Location permission denied',
              permissionGranted: false,
            }));
          }
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!cancelled) {
          setState({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            loading: false,
            error: null,
            permissionGranted: true,
          });
        }
      } catch (err: any) {
        if (!cancelled) {
          setState((s) => ({
            ...s,
            loading: false,
            error: err.message ?? 'Failed to get location',
          }));
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return state;
}
