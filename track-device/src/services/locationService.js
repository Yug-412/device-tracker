import { streamDatabasePath } from './firebase';

const toDevices = (value) =>
  Object.entries(value ?? {}).map(([deviceId, device]) => ({
    deviceId,
    ...device,
  }));

export const subscribeToDevices = (onData, onError) =>
  streamDatabasePath('devices', (value) => {
    console.log('subscribeToDevices payload', value);
    onData(toDevices(value));
  }, onError);

export const subscribeToDeviceHistory = (deviceId, onData, onError) => {
  if (!deviceId) {
    onData([]);
    return () => {};
  }

  const path = `history/${deviceId}`;

  return streamDatabasePath(
    path,
    (value) => {
      console.log(`history payload for ${deviceId}:`, value);
      const points = Object.values(value ?? {}).map((point) => ({
        latitude: Number(point.latitude ?? point.lat ?? 0),
        longitude: Number(point.longitude ?? point.lon ?? 0),
        timestamp: point.timestamp ?? point.ts ?? Date.now(),
      })).filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude));
      onData(points);
    },
    onError,
  );
};
