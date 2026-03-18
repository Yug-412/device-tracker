import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, orderByKey, query, ref, set, update } from 'firebase/database';

import { db } from '../config/firebase';
import { DAY_MS, LOCATION_INTERVAL_MS, LOCATION_TASK_NAME } from '../constants/tracking';

const STORAGE_KEYS = {
  userId: 'tracker.userId',
  userName: 'tracker.userName',
} as const;

export const getStoredUser = async () => {
  const [userId, userName] = await Promise.all([
    AsyncStorage.getItem(STORAGE_KEYS.userId),
    AsyncStorage.getItem(STORAGE_KEYS.userName),
  ]);

  return {
    userId,
    userName,
  };
};

export const saveUserProfile = async (userName: string) => {
  const trimmedName = userName.trim();
  const existing = await getStoredUser();
  const userId = existing.userId ?? `user_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  await AsyncStorage.multiSet([
    [STORAGE_KEYS.userId, userId],
    [STORAGE_KEYS.userName, trimmedName],
  ]);

  return { userId, userName: trimmedName };
};

const trimOldHistory = async (path: string, cutoff: number) => {
  const oldEntriesQuery = query(ref(db, path), orderByKey());
  const snapshot = await get(oldEntriesQuery);

  if (!snapshot.exists()) {
    return;
  }

  const updates: Record<string, null> = {};

  snapshot.forEach((item) => {
    const key = Number(item.key ?? 0);
    if (Number.isFinite(key) && key < cutoff) {
      updates[item.key as string] = null;
    }
  });

  if (Object.keys(updates).length > 0) {
    await update(ref(db, path), updates);
  }
};

export const writeLocationUpdate = async ({
  userId,
  userName,
  latitude,
  longitude,
  timestamp,
  hasPermission,
}: {
  userId: string;
  userName: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  hasPermission: boolean;
}) => {
  const tsKey = String(timestamp);

  const payload = {
    latitude,
    longitude,
    timestamp,
  };

  await Promise.all([
    set(ref(db, `users/${userId}`), {
      name: userName,
      permission: hasPermission,
    }),
    set(ref(db, `locations/${userId}/${tsKey}`), payload),
    update(ref(db, `devices/${userId}`), {
      name: userName,
      lastLocation: { lat: latitude, lng: longitude, timestamp },
      lastUpdated: timestamp,
    }),
    set(ref(db, `history/${userId}/${tsKey}`), {
      lat: latitude,
      lng: longitude,
      timestamp,
    }),
  ]);

  const cutoff = Date.now() - DAY_MS;
  await Promise.all([
    trimOldHistory(`locations/${userId}`, cutoff),
    trimOldHistory(`history/${userId}`, cutoff),
  ]);
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location task failed:', error.message);
    return;
  }

  const locationData = data as Location.LocationTaskOptions['data'] & {
    locations?: Location.LocationObject[];
  };

  const latestLocation = locationData?.locations?.[0];

  if (!latestLocation) {
    return;
  }

  const { userId, userName } = await getStoredUser();

  if (!userId || !userName) {
    return;
  }

  await writeLocationUpdate({
    userId,
    userName,
    latitude: latestLocation.coords.latitude,
    longitude: latestLocation.coords.longitude,
    timestamp: latestLocation.timestamp ?? Date.now(),
    hasPermission: true,
  });
});

export const requestLocationPermissions = async () => {
  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.status !== 'granted') {
    return false;
  }

  const background = await Location.requestBackgroundPermissionsAsync();
  return background.status === 'granted';
};

export const startBackgroundTracking = async () => {
  const alreadyStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

  if (alreadyStarted) {
    return;
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: LOCATION_INTERVAL_MS,
    distanceInterval: 0,
    pausesUpdatesAutomatically: false,
    foregroundService: {
      notificationTitle: 'GPS tracking is active',
      notificationBody: 'Your location is being updated in the background.',
    },
    showsBackgroundLocationIndicator: true,
  });
};
