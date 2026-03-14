import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "./firebase"
import LiveMap from "./LiveMap"

function Home(){

  const [devices,setDevices] = useState({})
  const [history,setHistory] = useState({})

  useEffect(()=>{

    // listen for device location
    const devicesRef = ref(db,"devices")

    onValue(devicesRef,(snapshot)=>{

      const data = snapshot.val()
      console.log("DEVICES:", data)

      if(data){
        setDevices(data)
      }

    })

    // listen for movement history
    const historyRef = ref(db,"history")

    onValue(historyRef,(snapshot)=>{

      const data = snapshot.val()
      console.log("HISTORY:", data)

      if(data){
        setHistory(data)
      }

    })

  },[])

  return(

    <div style={{padding:"20px"}}>

      <h1>📍 Device Tracking Platform</h1>

      <LiveMap
        devices={devices}
        history={history}
      />

    </div>

  )

}

export default Home