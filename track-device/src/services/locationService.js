import { streamDatabasePath } from './firebase';

const normalizeDevice = (deviceId, device) => ({
  deviceId,
  ...device,
  latitude: Number(device?.latitude ?? device?.lat),
  longitude: Number(device?.longitude ?? device?.lon),
  timestamp: Number(device?.timestamp ?? device?.ts ?? 0),
  online: Boolean(device?.online),
});

const toDevices = (value) =>
  Object.entries(value ?? {})
    .map(([deviceId, device]) => normalizeDevice(deviceId, device))
    .filter((device) => Number.isFinite(device.latitude) && Number.isFinite(device.longitude));

export const subscribeToDevices = (onData, onError) => {
  let latestDevices = [];

  const emitIfNeeded = (devices) => {
    latestDevices = devices;
    if (devices.length > 0) {
      onData(devices);
    }
  };

  const primaryCleanup = streamDatabasePath(
    'devices',
    (value) => {
      console.log('subscribeToDevices payload', value);
      const devices = toDevices(value);
      emitIfNeeded(devices);
    },
    onError,
  );

  const fallbackCleanup = streamDatabasePath(
    'location',
    (value) => {
      const devices = toDevices(value);
      if (latestDevices.length === 0 && devices.length > 0) {
        console.log('subscribeToDevices payload (location fallback)', value);
        onData(devices);
      }
    },
    onError,
  );

  return () => {
    primaryCleanup?.();
    fallbackCleanup?.();
  };
};

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
      const points = Object.values(value ?? {})
        .map((point) => ({
          latitude: Number(point.latitude ?? point.lat ?? 0),
          longitude: Number(point.longitude ?? point.lon ?? 0),
          timestamp: Number(point.timestamp ?? point.ts ?? 0),
        }))
        .filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
        .sort((a, b) => a.timestamp - b.timestamp);
      onData(points);
    },
    onError,
  );
};
