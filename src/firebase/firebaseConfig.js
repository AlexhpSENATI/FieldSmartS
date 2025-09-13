// src/firebase/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

/*
  Reemplaza estos valores por los de tu proyecto en Firebase Console (config web).
*/
const firebaseConfig = {
  apiKey: "AIzaSyDCuEs8DyAKA-UEgk1e9KDa4oTDmbh2wJA",
  authDomain: "smart-eae3a.firebaseapp.com",
  databaseURL: "https://smart-eae3a-default-rtdb.firebaseio.com",
  projectId: "smart-eae3a",
  storageBucket: "smart-eae3a.appspot.com",
  messagingSenderId: "501344504101",
  appId: "1:501344504101:web:ad1f3c08730a8aff5972cc",
  measurementId: "G-1QTGC2RXW9",
};

// Evitar inicializar más de una vez (útil con HMR / Vite)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Exporta la base de datos
export const db = getDatabase(app);
