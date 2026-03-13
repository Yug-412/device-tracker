import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "track-device.firebaseapp.com",
  databaseURL: "https://track-device-de376-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "track-device",
  storageBucket: "track-device.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);