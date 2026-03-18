import { useEffect, useMemo, useState } from 'react';

import { streamPath } from '../services/realtime';

const OFFLINE_THRESHOLD_MS = 60_000;

export const useDevices = () => {
  const [devicesMap, setDevicesMap] = useState({});

  useEffect(() => {
    return streamPath('devices', (value) => setDevicesMap(value ?? {}), console.error);
  }, []);

  const devices = useMemo(() => {
    const now = Date.now();

    return Object.entries(devicesMap)
      .map(([userId, value]) => {
        const lastUpdated = Number(value?.lastUpdated ?? 0);
        const lastLocation = value?.lastLocation ?? {};

        return {
          userId,
          name: value?.name ?? 'Unknown User',
          lastUpdated,
          lastLocation: {
            lat: Number(lastLocation.lat),
            lng: Number(lastLocation.lng),
            timestamp: Number(lastLocation.timestamp ?? lastUpdated),
          },
          online: now - lastUpdated <= OFFLINE_THRESHOLD_MS,
        };
      })
      .sort((a, b) => b.lastUpdated - a.lastUpdated);
  }, [devicesMap]);

  return devices;
};
