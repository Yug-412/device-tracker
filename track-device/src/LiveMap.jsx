import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const FitToDevices = ({ devices }) => {
  const map = useMap();

  const points = useMemo(
    () =>
      Object.values(devices ?? {})
        .filter((d) => d?.latitude && d?.longitude)
        .map((d) => [Number(d.latitude), Number(d.longitude)]),
    [devices],
  );

  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }
    map.fitBounds(points, { padding: [30, 30] });
  }, [map, points]);

  return null;
};

function LiveMap({ devices, history }) {
  const deviceArray = devices ? Object.values(devices) : [];
  const defaultCenter = [22.30, 72.60];

  console.log('LiveMap devices', devices);
  console.log('LiveMap history', history);

  return (
    <MapContainer center={defaultCenter} zoom={3} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitToDevices devices={devices} />

      {deviceArray.map((d, index) => {
        if (typeof d.latitude !== 'number' && typeof d.latitude !== 'string') return null;
        if (typeof d.longitude !== 'number' && typeof d.longitude !== 'string') return null;

        return (
          <Marker key={`${d.vehicleId || d.deviceId}-${index}`} position={[Number(d.latitude), Number(d.longitude)]}>
            <Popup>
              {d.deviceId ?? 'Unknown'}<br />
              lat: {d.latitude}<br />
              lon: {d.longitude}
            </Popup>
          </Marker>
        );
      })}

      {history &&
        Object.keys(history).map((deviceID) => {
          const coords = Object.values(history[deviceID] ?? {})
            .map((p) => [Number(p.latitude), Number(p.longitude)])
            .filter((coord) => Number.isFinite(coord[0]) && Number.isFinite(coord[1]));

          if (coords.length < 2) return null;

          return <Polyline key={deviceID} positions={coords} color="blue" />;
        })}
    </MapContainer>
  );
}

export default LiveMap