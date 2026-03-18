import { useEffect, useState } from 'react';

import { streamPath } from '../services/realtime';

const DAY_MS = 24 * 60 * 60 * 1000;

export const useDeviceHistory = (userId) => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    if (!userId) {
      setPoints([]);
      return undefined;
    }

    return streamPath(
      `history/${userId}`,
      (value) => {
        const cutoff = Date.now() - DAY_MS;
        const mapped = Object.entries(value ?? {})
          .map(([timestamp, point]) => ({
            timestamp: Number(timestamp),
            lat: Number(point?.lat),
            lng: Number(point?.lng),
          }))
          .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng))
          .filter((point) => point.timestamp >= cutoff)
          .sort((a, b) => a.timestamp - b.timestamp);

        setPoints(mapped);
      },
      console.error,
    );
  }, [userId]);

  return points;
};
