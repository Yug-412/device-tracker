import { useEffect } from "react";

function TrackLocation(){

  useEffect(()=>{

    navigator.geolocation.watchPosition((position)=>{

      fetch("http://localhost:5000/location",{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({

          latitude:position.coords.latitude,
          longitude:position.coords.longitude

        })

      })

    })

  },[])

  return(

    <div style={{textAlign:"center",marginTop:"100px"}}>

      <h2>📍 Location Sharing</h2>

      <p>Please allow location access to share your location.</p>

    </div>

  )
}

export default TrackLocation