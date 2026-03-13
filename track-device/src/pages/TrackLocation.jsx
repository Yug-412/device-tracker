import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { db } from "../services/firebase"
import { ref,set } from "firebase/database"

function TrackLocation(){

 const { id } = useParams()

 useEffect(()=>{

  if(navigator.geolocation){

   navigator.geolocation.watchPosition((pos)=>{

    const latitude = pos.coords.latitude
    const longitude = pos.coords.longitude

    set(ref(db,`devices/${id}`),{
      latitude,
      longitude,
      timestamp: Date.now(),
      online:true
    })

   })

  }

 },[])

 return(
  <h2>Location sharing active</h2>
 )

}

export default TrackLocation