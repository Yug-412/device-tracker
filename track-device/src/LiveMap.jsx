import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

const deviceIcon = new L.Icon({
 iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
 iconSize: [35,35],
 iconAnchor: [17,35]
})

function LiveMap({devices,history}){

 const deviceArray = devices ? Object.values(devices) : []

 const center = deviceArray.length
  ? [deviceArray[0].latitude, deviceArray[0].longitude]
  : [22.30,72.60]

 return(

 <MapContainer
  center={center}
  zoom={13}
  style={{height:"500px",width:"100%"}}
 >

  <TileLayer
   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  {/* Device markers */}

  {devices && Object.keys(devices).map(id=>{

   const d = devices[id]

   return(

    <Marker
     key={id}
     position={[d.latitude,d.longitude]}
     icon={deviceIcon}
    >

     <Popup>

      Device: {id} <br/>
      Lat: {d.latitude} <br/>
      Lon: {d.longitude}

     </Popup>

    </Marker>

   )

  })}

  {/* Movement path */}

  {history && Object.keys(history).map(deviceID=>{

   const coords = Object.values(history[deviceID]).map(point=>[
    point.latitude,
    point.longitude
   ])

   return(

    <Polyline
     key={deviceID}
     positions={coords}
     color="blue"
    />

   )

  })}

 </MapContainer>

 )

}

export default LiveMap