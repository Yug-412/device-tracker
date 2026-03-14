import { MapContainer,TileLayer,Marker,Polyline,Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

function LiveMap({devices,history}){

 const deviceArray = devices ? Object.values(devices) : []

 const center = deviceArray.length
  ? [deviceArray[0].latitude,deviceArray[0].longitude]
  : [22.30,72.60]

 return(

 <MapContainer
  center={center}
  zoom={13}
  style={{height:"500px"}}
 >

  <TileLayer
   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  {devices && Object.keys(devices).map(deviceID=>{

   const d = devices[deviceID]

   return(

    <Marker
     key={deviceID}
     position={[d.latitude,d.longitude]}
    >

     <Popup>

      Device: {deviceID} <br/>
      Lat: {d.latitude} <br/>
      Lon: {d.longitude}

     </Popup>

    </Marker>

   )

  })}

  {history && Object.keys(history).map(deviceID=>{

   const coords = Object.values(history[deviceID]).map(p=>[
    p.latitude,
    p.longitude
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