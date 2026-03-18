import { useEffect, useMemo, useState } from "react";
import {
  LayersControl,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap
} from "react-leaflet";

import { subscribeToDeviceHistory } from "../services/locationService";
import { vehicleIcon } from "../icons/vehicleIcon";

const DEFAULT_CENTER = [20, 0];

const FitToDevices = ({ devices, selectedDeviceId }) => {

  const map = useMap();

  useEffect(() => {

    const points = devices
      .filter(d => Number.isFinite(d.latitude) && Number.isFinite(d.longitude))
      .map(d => [d.latitude, d.longitude]);

    const selected = devices.find(d => d.deviceId === selectedDeviceId);
    if (selected && Number.isFinite(selected.latitude) && Number.isFinite(selected.longitude)) {
      map.setView([selected.latitude, selected.longitude], 17, { animate: true });
      return;
    }

    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView(points[0], 13);
    } else {
      map.fitBounds(points, { padding: [40, 40] });
    }

  }, [devices, selectedDeviceId, map]);

  return null;
};

const LiveMap = ({ devices, selectedDeviceId }) => {

  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!selectedDeviceId) {
      setHistory([]);
      return () => {};
    }

    return subscribeToDeviceHistory(selectedDeviceId, setHistory);
  }, [selectedDeviceId]);

  const selectedDevice = useMemo(() => {
    return devices.find((d) => d.deviceId === selectedDeviceId);
  }, [devices, selectedDeviceId]);

  const routePositions = useMemo(() => {
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;

    return history
      .filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
      .filter((p) => {
        if (!p.timestamp) return true;
        const ts = Number(p.timestamp);
        return !Number.isNaN(ts) ? ts >= dayAgo : true;
      })
      .map((p) => [p.latitude, p.longitude]);
  }, [history]);

  return (
    <section className="map-panel" style={{ height: '100%', minHeight: '420px' }}>

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={3}
        scrollWheelZoom
        style={{ width: '100%', height: '100%' }}
      >

        <LayersControl position="topright">

          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, NASA, NGA, USGS"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite + Labels">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, NASA, NGA, USGS"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name="OSM Labels">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              opacity={0.75}
            />
          </LayersControl.Overlay>

          <LayersControl.BaseLayer name="Street Map">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

        </LayersControl>

        <FitToDevices devices={devices} selectedDeviceId={selectedDeviceId} />

        {devices.map(device => {

          if (!Number.isFinite(device.latitude) || !Number.isFinite(device.longitude)) {
            return null;
          }

          const position = [device.latitude, device.longitude];

          return (
            <Marker
              key={device.deviceId}
              position={position}
              icon={vehicleIcon}
            >
              <Popup>

                <strong>{device.name ?? device.driverName ?? "Unknown driver"}</strong>

                <br />
                Vehicle: {device.vehicleName ?? "Unknown"}

                <br />
                Speed: {Math.round(device.speed ?? 0)} km/h

                <br />
                Status: {device.online ? "🟢 Online" : "🔴 Offline"}

                <br />
                Device ID: {device.deviceId}

              </Popup>
            </Marker>
          );

        })}

        {selectedDevice && routePositions.length > 1 && (
          <>
            <Polyline
              positions={routePositions}
              pathOptions={{ color: "#2563eb", weight: 4 }}
            />
            <Marker
              position={routePositions[routePositions.length - 1]}
              icon={vehicleIcon}
            >
              <Popup>
                <strong>{selectedDevice.vehicleName ?? selectedDevice.deviceId}</strong>
                <br />
                Last seen: {new Date(selectedDevice.timestamp || Date.now()).toLocaleString()}
              </Popup>
            </Marker>
          </>
        )}

      </MapContainer>

    </section>
  );
};

export default LiveMap;