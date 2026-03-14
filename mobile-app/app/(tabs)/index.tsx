import { View, Text } from "react-native";
import * as Location from "expo-location";
import { useEffect } from "react";

import { db } from "../../firebase";
import { ref, set, push } from "firebase/database";

export default function HomeScreen() {

  useEffect(() => {

    const startTracking = async () => {

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("Location permission denied");
        return;
      }

      const deviceId = "device1";

      setInterval(async () => {

        const loc = await Location.getCurrentPositionAsync({});

        const latitude = loc.coords.latitude;
        const longitude = loc.coords.longitude;
        const timestamp = Date.now();

        // update current location
        set(ref(db, "devices/" + deviceId), {
          latitude,
          longitude,
          timestamp,
          online: true
        });

        // save movement history
        push(ref(db, "history/" + deviceId), {
          latitude,
          longitude,
          timestamp
        });

      }, 5000); // every 5 seconds

    };

    startTracking();

  }, []);

  return (

    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>

      <Text style={{fontSize:22}}>
        Tracking Active 📍
      </Text>

    </View>

  );

}