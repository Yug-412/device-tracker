import { useEffect } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const FitToPoints = ({ devices, routePoints }) => {
  const map = useMap();

  useEffect(() => {
    const positions = [
      ...devices
        .map((device) => [device.lastLocation.lat, device.lastLocation.lng])
        .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng)),
      ...routePoints.map((point) => [point.lat, point.lng]),
    ];

    if (positions.length === 0) {
      return;
    }

    if (positions.length === 1) {
      map.setView(positions[0], 15);
      return;
    }

    map.fitBounds(positions, { padding: [30, 30] });
  }, [devices, map, routePoints]);

  return null;
};

const LiveMap = ({ devices, selectedDevice, routePoints }) => (
  <section className="map-panel">
    <MapContainer className="map" center={[0, 0]} zoom={2}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitToPoints devices={devices} routePoints={routePoints} />

      {devices.map((device) => {
        const { lat, lng } = device.lastLocation;
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          return null;
        }

        return (
          <Marker key={device.userId} icon={markerIcon} position={[lat, lng]}>
            <Popup>
              <strong>{device.name}</strong>
              <br />
              Status: {device.online ? 'Online' : 'Offline'}
              <br />
              Last update: {new Date(device.lastUpdated).toLocaleString()}
            </Popup>
          </Marker>
        );
      })}

      {selectedDevice && routePoints.length > 1 ? (
        <Polyline positions={routePoints.map((point) => [point.lat, point.lng])} pathOptions={{ color: '#2563eb', weight: 4 }} />
      ) : null}
    </MapContainer>
  </section>
);

export default LiveMap;
