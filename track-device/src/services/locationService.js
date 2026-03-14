import { streamDatabasePath } from './firebase';

const normalizeDevicesValue = (value) =>
  Object.entries(value ?? {}).map(([deviceId, device]) => ({
    deviceId,
    ...device,
  }));

const mergeDeviceLists = (base = {}, fallback = {}) => {
  const devices = {};
  Object.entries(base ?? {}).forEach(([id, d]) => {
    devices[id] = { deviceId: id, ...d };
  });
  Object.entries(fallback ?? {}).forEach(([id, d]) => {
    devices[id] = { deviceId: id, ...devices[id], ...d };
  });
  return Object.values(devices);
};

export const subscribeToDevices = (onData, onError) => {
  let devicesValue = {};
  let locationValue = {};

  const emit = () => {
    const merged = mergeDeviceLists(devicesValue, locationValue);
    console.log('subscribeToDevices merged', merged);
    onData(merged);
  };

  const stopDevices = streamDatabasePath('devices', (value) => {
    devicesValue = value ?? {};
    emit();
  }, onError);

  const stopLocation = streamDatabasePath('location', (value) => {
    locationValue = value ?? {};
    emit();
  }, onError);

  return () => {
    stopDevices();
    stopLocation();
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