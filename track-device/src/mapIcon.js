import L from "leaflet"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

const icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

export default icon