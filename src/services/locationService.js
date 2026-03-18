import { ref, onValue } from "firebase/database"
import { db } from "./firebase"

// listen to devices (current location)
export function subscribeToDevices(callback){

 const devicesRef = ref(db,"devices")

 onValue(devicesRef,(snapshot)=>{

  const data = snapshot.val()

  if(data){

   const devices = Object.keys(data).map(id=>({
    deviceId:id,
    ...data[id]
   }))

   callback(devices)

  }else{
   callback([])
  }

 })

}

// listen to device history (movement path)
export function subscribeToDeviceHistory(deviceId, callback){
  if (!deviceId) {
    callback([])
    return () => {}
  }

  const historyRef = ref(db, `history/${deviceId}`)

  return onValue(historyRef, (snapshot) => {
    const data = snapshot.val()

    if (!data) {
      callback([])
      return
    }

    // convert keyed object into sorted array
    const points = Object.keys(data)
      .map((key) => {
        const item = data[key]
        return {
          id: key,
          ...item,
        }
      })
      .sort((a, b) => {
        if (a.timestamp == null || b.timestamp == null) return 0
        return Number(a.timestamp) - Number(b.timestamp)
      })

    callback(points)
  })
}
