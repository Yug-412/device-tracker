import { useState } from "react";

function Home() {

  const [link,setLink] = useState("")
  const [location,setLocation] = useState(null)

  const generateLink = () => {

    const id = Math.floor(Math.random()*100000)

    const newLink = `http://localhost:5173/track/${id}`

    setLink(newLink)

  }

  const copyLink = () => {

    navigator.clipboard.writeText(link)

    alert("Link copied!")

  }

  return (

    <div style={{textAlign:"center",marginTop:"80px"}}>

      <h1>📍 Device Tracker Dashboard</h1>

      <button onClick={generateLink}>
        Generate Tracking Link
      </button>

      <br/><br/>

      {link && (

        <div>

          <input
            value={link}
            readOnly
            style={{
              width:"320px",
              padding:"10px"
            }}
          />

          <button onClick={copyLink} style={{marginLeft:"10px"}}>
            Copy Link
          </button>

        </div>

      )}

      <br/><br/>

      <button
        onClick={()=>{
          fetch("http://localhost:5000/location")
          .then(res=>res.json())
          .then(data=>setLocation(data))
        }}
      >
        Get Latest Location
      </button>

      {location && (

        <div>

          <p>Latitude: {location.latitude}</p>

          <p>Longitude: {location.longitude}</p>

        </div>

      )}

    </div>

  )

}

export default Home