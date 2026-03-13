import { useState } from "react";
import MapView from "./MapView";

function Home() {

  const [link, setLink] = useState("")
  const [location, setLocation] = useState(null)

  const generateLink = () => {

    const id = Math.floor(Math.random() * 100000)

    const link = `${window.location.origin}/track/${id}`

    setLink(link)

  }

  const copyLink = () => {

    navigator.clipboard.writeText(link)

    alert("Link copied!")

  }

  return (

    <div style={{ textAlign: "center", marginTop: "80px" }}>

      <h1>📍 Device Tracker Dashboard</h1>

      <button onClick={generateLink}>
        Generate Tracking Link
      </button>

      <br /><br />

      {link && (

        <div>

          <p>
            Share this link with the user and ask them to open it:
          </p>

          <input
            value={link}
            readOnly
            style={{
              width: "320px",
              padding: "10px"
            }}
          />

          <button onClick={copyLink} style={{ marginLeft: "10px" }}>
            Copy Link
          </button>

          <div style={{ marginTop: "12px" }}>
            <a href={link} target="_blank" rel="noreferrer">
              Open Tracking Link
            </a>
          </div>

        </div>

      )}

      <br /><br />

      <button
        onClick={() => {
          fetch("http://localhost:5000/location")
            .then(res => res.json())
            .then(data => setLocation(data))
        }}
      >
        Get Latest Location
      </button>

      {location && (
        <div>

          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>

          <MapView location={location} />

        </div>
      )}

    </div>

  )

}

export default Home
