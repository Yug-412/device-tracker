import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { ref, set, push } from 'firebase/database';
import { database } from '../firebase';

const TRACKING_TASK_NAME = 'device-background-tracking';

let metadata = {
  deviceId: '',
  driverName: '',
  vehicleName: '',
};

TaskManager.defineTask(TRACKING_TASK_NAME, async ({ data, error }) => {
  if (error || !data?.locations?.length) {
    return;
  }

  const { latitude, longitude, speed } = data.locations[0].coords;
  const payload = {
    deviceId: metadata.deviceId,
    driverName: metadata.driverName,
    vehicleName: metadata.vehicleName,
    latitude,
    longitude,
    speed: speed ? Number(speed.toFixed(2)) : 0,
    timestamp: Date.now(),
    online: true,
  };

  if (!metadata.deviceId) {
    return;
  }

  await set(ref(database, `devices/${metadata.deviceId}`), payload);
  await push(ref(database, `history/${metadata.deviceId}/locationPoints`), payload);
});

export const requestTrackingPermission = async () => {
  const foreground = await Location.requestForegroundPermissionsAsync();

  if (foreground.status !== 'granted') {
    throw new Error('Foreground location permission denied.');
  }

  const background = await Location.requestBackgroundPermissionsAsync();

  if (background.status !== 'granted') {
    throw new Error('Background location permission denied. Please allow all the time.');
  }
};

export const startBackgroundTracking = async (nextMetadata) => {
  metadata = nextMetadata;

  const started = await Location.hasStartedLocationUpdatesAsync(TRACKING_TASK_NAME);
  if (started) {
    return;
  }

  await Location.startLocationUpdatesAsync(TRACKING_TASK_NAME, {
    accuracy: Location.Accuracy.BestForNavigation,
    timeInterval: 5000,
    distanceInterval: 0,
    pausesUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: 'Device tracking enabled',
      notificationBody: 'Your location is being shared with dispatch.',
    },
  });
};

export const stopBackgroundTracking = async (deviceId) => {
  const started = await Location.hasStartedLocationUpdatesAsync(TRACKING_TASK_NAME);

  if (started) {
    await Location.stopLocationUpdatesAsync(TRACKING_TASK_NAME);
  }

  if (deviceId) {
    await set(ref(database, `devices/${deviceId}/online`), false);
  }
};
