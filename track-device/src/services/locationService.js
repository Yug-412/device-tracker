import { streamDatabasePath } from './firebase';

const toDevices = (value) =>
  Object.entries(value ?? {}).map(([deviceId, device]) => ({
    deviceId,
    ...device,
  }));

export const subscribeToDevices = (onData, onError) =>
  streamDatabasePath('devices', (value) => onData(toDevices(value)), onError);

export const subscribeToDeviceHistory = (deviceId, onData, onError) => {
  if (!deviceId) {
    onData([]);
    return () => {};
  }

  return streamDatabasePath(
    `history/${deviceId}/locationPoints`,
    (value) => {
      const points = Object.values(value ?? {}).map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude,
        timestamp: point.timestamp,
      }));
      onData(points);
    },
    onError,
  );
};
