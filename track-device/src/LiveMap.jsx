import { useEffect, useMemo, useState } from 'react';
import {
  LayersControl,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import { subscribeToDeviceHistory } from '../services/locationService';
import { vehicleIcon } from '../icons/vehicleIcon';

const DEFAULT_CENTER = [20, 0];

const FitToDevices = ({ devices }) => {
  const map = useMap();

  useEffect(() => {
    const points = devices
      .filter((d) => typeof d.latitude === 'number' && typeof d.longitude === 'number')
      .map((d) => [d.latitude, d.longitude]);

    if (points.length === 0) {
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }

    map.fitBounds(points, { padding: [30, 30] });
  }, [devices, map]);

  return null;
};

const LiveMap = ({ devices, selectedDeviceId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!selectedDeviceId) {
      return undefined;
    }
    return subscribeToDeviceHistory(selectedDeviceId, setHistory, console.error);
  }, [selectedDeviceId]);

  const selectedDevice = useMemo(
    () => devices.find((device) => device.deviceId === selectedDeviceId),
    [devices, selectedDeviceId],
  );

  return (
    <section className="map-panel">
      <MapContainer center={DEFAULT_CENTER} zoom={3} scrollWheelZoom className="map">
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='Tiles &copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <FitToDevices devices={devices} />

        {devices.map((device) =>
          typeof device.latitude === 'number' && typeof device.longitude === 'number' ? (
            <Marker
              key={device.deviceId}
              position={[device.latitude, device.longitude]}
              icon={vehicleIcon}
            >
              <Popup>
                <strong>{device.driverName ?? 'Unknown driver'}</strong>
                <br />
                Vehicle: {device.vehicleName ?? 'Unknown'}
                <br />
                Speed: {Math.round(device.speed ?? 0)} km/h
                <br />
                Status: {device.online ? 'Online' : 'Offline'}
              </Popup>
            </Marker>
          ) : null,
        )}

        {selectedDevice && history.length > 1 ? (
          <Polyline
            positions={history.map((point) => [point.latitude, point.longitude])}
            pathOptions={{ color: '#2563eb', weight: 4 }}
          />
        ) : null}
      </MapContainer>
    </section>
  );
};

export default LiveMap;