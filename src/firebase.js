// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Configuración de tu nuevo proyecto
const firebaseConfig = {
    apiKey: "AIzaSyCna_uUBQ-E6jvkK4ULINb_2GmGc4Z_6K4",
    authDomain: "smart-5129b.firebaseapp.com",
    databaseURL: "https://smart-5129b-default-rtdb.firebaseio.com",
    projectId: "smart-5129b",
    storageBucket: "smart-5129b.firebasestorage.app",
    messagingSenderId: "553559595908",
    appId: "1:553559595908:web:c251721385b74cec0c5bd1",
    measurementId: "G-8BHJMLKP1P"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializar Realtime Database
const db = getDatabase(app);

// Exportar db para usar en otros archivos
export { db };
