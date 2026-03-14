// Import the functions you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnL1bmiBY6te5m7112zCc7VfsZsQV-hm8",
  authDomain: "device-track-330b1.firebaseapp.com",
  databaseURL: "https://device-track-330b1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "device-track-330b1",
  storageBucket: "device-track-330b1.firebasestorage.app",
  messagingSenderId: "790788580454",
  appId: "1:790788580454:web:640f8c560b7c0f2db1b9a7",
  measurementId: "G-ZX8N30W41B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const db = getDatabase(app);