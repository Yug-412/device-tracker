import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "./firebase"
import LiveMap from "./LiveMap"

function Home(){

 const [devices,setDevices] = useState({})
 const [history,setHistory] = useState({})

 useEffect(()=>{

  const devicesRef = ref(db,"devices")

  onValue(devicesRef,(snapshot)=>{

   const data = snapshot.val()

   if(data){
    setDevices(data)
   }

  })

  const historyRef = ref(db,"history")

  onValue(historyRef,(snapshot)=>{

   const data = snapshot.val()

   if(data){
    setHistory(data)
   }

  })

 },[])

 return(

  <div style={{padding:"20px"}}>

   <h1>📍 Live Device Tracker</h1>

   <LiveMap
    devices={devices}
    history={history}
   />

  </div>

 )

}

export default Home