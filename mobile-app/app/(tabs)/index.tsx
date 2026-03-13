import { View, Text, Button } from "react-native";
import * as Location from "expo-location";
import { useState } from "react";

import { db } from "../../firebase";
import { ref, set } from "firebase/database";

export default function HomeScreen() {

  const [location, setLocation] = useState<any>(null);

  const getLocation = async () => {

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("Location permission denied");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});

    const latitude = loc.coords.latitude;
    const longitude = loc.coords.longitude;

    setLocation(loc.coords);

    // send to firebase
    set(ref(db, "devices/device1"), {
      latitude,
      longitude,
      timestamp: Date.now(),
      online: true
    });

  };

  return (

    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>

      <Text style={{fontSize:22}}>Device Tracker</Text>

      <Button
        title="Send Location"
        onPress={getLocation}
      />

      {location && (
        <Text>
          Lat: {location.latitude}  
          Lon: {location.longitude}
        </Text>
      )}

    </View>

  );

}