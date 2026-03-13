import { MapContainer, TileLayer, Marker, Polyline, Popup, LayersControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

const { BaseLayer } = LayersControl

// Online icon
const onlineIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743922.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36]
})

// Offline icon
const offlineIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/565/565547.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36]
})

function LiveMap({ devices = {}, history = {} }) {

  const deviceArray = Object.values(devices)

  const center =
    deviceArray.length > 0
      ? [deviceArray[0].latitude, deviceArray[0].longitude]
      : [22.30, 72.60]

  return (

    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
      scrollWheelZoom={true}
    >

      <LayersControl position="topright">

        {/* Street Map */}
        <BaseLayer checked name="Street Map">
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>

        {/* Satellite Map */}
        <BaseLayer name="Satellite Map">
          <TileLayer
            attribution="Tiles © Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </BaseLayer>

      </LayersControl>

      {/* Device markers */}
      {Object.keys(devices).map(deviceID => {

        const d = devices[deviceID]

        if (!d.latitude || !d.longitude) return null

        return (

          <Marker
            key={deviceID}
            position={[d.latitude, d.longitude]}
            icon={d.online ? onlineIcon : offlineIcon}
          >

            <Popup>

              <strong>Driver:</strong> {d.driverName || "Unknown"} <br />
              <strong>Vehicle:</strong> {d.vehicleName || "Unknown"} <br />
              <strong>Status:</strong> {d.online ? "🟢 Online" : "🔴 Offline"}

            </Popup>

          </Marker>

        )

      })}

      {/* Movement history path */}
      {Object.keys(history).map(deviceID => {

        const coords = Object.values(history[deviceID]).map(p => [
          p.latitude,
          p.longitude
        ])

        if (coords.length < 2) return null

        return (
          <Polyline
            key={deviceID}
            positions={coords}
            color="blue"
            weight={4}
          />
        )

      })}

    </MapContainer>

  )
}

export default LiveMap