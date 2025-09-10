// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Configuración de Firebase (tu misma config que ya tienes)
const firebaseConfig = {
  apiKey: "AIzaSyBqlMrCp7cUcQ4xNGMPM_urU1UfXEOtEG8",
  authDomain: "smart-ceb0f.firebaseapp.com",
  databaseURL: "https://smart-ceb0f-default-rtdb.firebaseio.com",
  projectId: "smart-ceb0f",
  storageBucket: "smart-ceb0f.firebasestorage.app",
  messagingSenderId: "263148013514",
  appId: "1:263148013514:web:cfc1e2e434f16ae298f133",
  measurementId: "G-8P55Y4R9DR"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Realtime Database
const db = getDatabase(app);

// 👇 exportamos db para que puedas usarlo en AppContext y otros lados
export { db };
