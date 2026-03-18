import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";
import { ref, update, push } from "firebase/database";

function TrackLocation() {

  const { id } = useParams();

  useEffect(() => {

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(

      (pos) => {

        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        const speed = pos.coords.speed || 0;

        // Update live device location
        update(ref(db, `devices/${id}`), {
          latitude,
          longitude,
          speed,
          online: true,
          timestamp: Date.now()
        });

        // Save route history
        push(ref(db, `history/${id}`), {
          latitude,
          longitude,
          timestamp: Date.now()
        });

      },

      (err) => console.error(err),

      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 5000
      }

    );

    return () => navigator.geolocation.clearWatch(watchId);

  }, [id]);

  return (
    <div style={{padding:"20px"}}>
      <h2>📡 Tracking Active</h2>
      <p>Device ID: {id}</p>
    </div>
  );
}

export default TrackLocation;