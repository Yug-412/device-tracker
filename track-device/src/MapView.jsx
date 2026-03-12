import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapView({ location }) {

  if (!location) return <p>No location available</p>;

  return (

    <MapContainer
      center={[location.latitude, location.longitude]}
      zoom={13}
      style={{ height: "400px", width: "100%", marginTop: "20px" }}
    >

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[location.latitude, location.longitude]}>
        <Popup>
          Device Location
        </Popup>
      </Marker>

    </MapContainer>

  );
}

export default MapView;