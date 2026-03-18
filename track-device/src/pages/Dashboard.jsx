/* global google */
import { useEffect, useMemo, useRef, useState } from 'react';
import { streamDatabasePath } from '../services/firebase';

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const MAX_ROUTE_POINTS = 800;
const PATH_COLOR = '#1E90FF';
const DEFAULT_CENTER = { lat: 23.0225, lng: 72.5714 };

const normalizeTimestamp = (timestamp) => {
  if (timestamp == null) return null;
  const value = Number(timestamp);
  if (!Number.isFinite(value)) return null;
  return value < 1_000_000_000_000 ? value * 1000 : value;
};

const parseLocations = (snapshotValue) => {
  const points = Object.values(snapshotValue ?? {})
    .map((point) => {
      const lat = Number(point.lat ?? point.latitude);
      const lng = Number(point.lng ?? point.longitude);
      const timestamp = normalizeTimestamp(point.timestamp);

      if (!Number.isFinite(lat) || !Number.isFinite(lng) || !timestamp) {
        return null;
      }

      return { lat, lng, timestamp };
    })
    .filter(Boolean)
    .sort((a, b) => a.timestamp - b.timestamp);

  if (points.length === 0) {
    return [];
  }

  const latestTimestamp = points[points.length - 1].timestamp;
  const cutoff = latestTimestamp - TWENTY_FOUR_HOURS_MS;
  return points.filter((point) => point.timestamp >= cutoff);
};

const simplifyPath = (points, maxPoints = MAX_ROUTE_POINTS) => {
  if (points.length <= maxPoints) {
    return points;
  }

  const stride = Math.ceil(points.length / maxPoints);
  const reduced = points.filter((_, index) => index % stride === 0);
  const lastPoint = points[points.length - 1];

  if (reduced[reduced.length - 1] !== lastPoint) {
    reduced.push(lastPoint);
  }

  return reduced;
};

const createDeviceIcon = () => ({
  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
  fillColor: '#1E3A8A',
  fillOpacity: 1,
  strokeColor: '#ffffff',
  strokeWeight: 2,
  scale: 6,
  rotation: 0,
});

const Dashboard = () => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');
  const missingApiKeyError = !import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    ? 'Missing VITE_GOOGLE_MAPS_API_KEY in your environment variables.'
    : '';

  const mapRef = useRef(null);
  const mapNodeRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);
  const infoWindowRef = useRef(null);
  const latestPositionRef = useRef(null);
  const animationFrameRef = useRef(null);
  const routeRef = useRef([]);

  const route = useMemo(() => simplifyPath(locations), [locations]);
  const latestLocation = route[route.length - 1] ?? null;

  useEffect(() => {
    routeRef.current = route;
  }, [route]);

  useEffect(() => {
    const deviceId = import.meta.env.VITE_TRACKING_DEVICE_ID || 'device_001';

    const unsubscribe = streamDatabasePath(
      `tracking_locations/${deviceId}`,
      (value) => {
        setError('');
        setLocations(parseLocations(value));
      },
      (err) => {
        setError(err?.message ?? 'Unable to stream GPS updates from Firebase.');
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return undefined;
    }

    const initializeMap = () => {
      if (!mapNodeRef.current || mapRef.current || !window.google) {
        return;
      }

      mapRef.current = new google.maps.Map(mapNodeRef.current, {
        center: DEFAULT_CENTER,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      markerRef.current = new google.maps.Marker({
        map: mapRef.current,
        icon: createDeviceIcon(),
        title: 'Tracked device',
      });

      polylineRef.current = new google.maps.Polyline({
        map: mapRef.current,
        strokeColor: PATH_COLOR,
        strokeOpacity: 0.95,
        strokeWeight: 5,
      });

      startMarkerRef.current = new google.maps.Marker({
        map: mapRef.current,
        label: 'S',
        visible: false,
      });

      endMarkerRef.current = new google.maps.Marker({
        map: mapRef.current,
        label: 'E',
        visible: false,
      });

      infoWindowRef.current = new google.maps.InfoWindow();

      polylineRef.current.addListener('click', (event) => {
        if (!infoWindowRef.current || routeRef.current.length === 0) {
          return;
        }

        const nearest = routeRef.current.reduce(
          (best, point) => {
            const distance = Math.hypot(
              event.latLng.lat() - point.lat,
              event.latLng.lng() - point.lng,
            );
            return distance < best.distance ? { point, distance } : best;
          },
          { point: routeRef.current[0], distance: Number.POSITIVE_INFINITY },
        );

        infoWindowRef.current.setContent(
          `<div><strong>${new Date(nearest.point.timestamp).toLocaleString()}</strong></div>`,
        );
        infoWindowRef.current.setPosition(event.latLng);
        infoWindowRef.current.open({ map: mapRef.current });
      });
    };

    if (window.google?.maps) {
      initializeMap();
    } else {
      const scriptId = 'google-maps-sdk';
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', initializeMap);
      script.addEventListener('error', () => setError('Unable to load Google Maps script.'));

      return () => {
        script.removeEventListener('load', initializeMap);
      };
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !polylineRef.current) {
      return;
    }

    if (route.length === 0) {
      polylineRef.current.setPath([]);
      startMarkerRef.current?.setVisible(false);
      endMarkerRef.current?.setVisible(false);
      return;
    }

    const path = route.map((point) => ({ lat: point.lat, lng: point.lng }));
    polylineRef.current.setPath(path);

    const start = path[0];
    const end = path[path.length - 1];

    startMarkerRef.current?.setPosition(start);
    startMarkerRef.current?.setVisible(true);
    endMarkerRef.current?.setPosition(end);
    endMarkerRef.current?.setVisible(true);

    const previousPosition = latestPositionRef.current;
    latestPositionRef.current = end;

    if (!previousPosition) {
      markerRef.current.setPosition(end);
      mapRef.current.setCenter(end);
      return;
    }

    const duration = 900;
    const startTime = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const lat = previousPosition.lat + (end.lat - previousPosition.lat) * progress;
      const lng = previousPosition.lng + (end.lng - previousPosition.lng) * progress;
      markerRef.current.setPosition({ lat, lng });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(animate);
    mapRef.current.panTo(end);
  }, [route]);

  return (
    <main className="dashboard">
      <header>
        <h1>Real-time GPS Tracking Dashboard</h1>
        <p>Live route replay from Firebase Realtime Database for the last 24 hours.</p>
      </header>

      <section className="stats-panel">
        <article>
          <h3>Route points (24h)</h3>
          <p>{locations.length}</p>
        </article>
        <article>
          <h3>Rendered points</h3>
          <p>{route.length}</p>
        </article>
        <article>
          <h3>Latest ping</h3>
          <p>{latestLocation ? new Date(latestLocation.timestamp).toLocaleTimeString() : '--'}</p>
        </article>
      </section>

      {missingApiKeyError || error ? <p className="error">{missingApiKeyError || error}</p> : null}

      <section className="map-panel">
        <div ref={mapNodeRef} className="map" />
      </section>
    </main>
  );
};

export default Dashboard;
