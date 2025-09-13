// backend/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDCuEs8DyAKA-UEgk1e9KDa4oTDmbh2wJA",
  authDomain: "smart-eae3a.firebaseapp.com",
  databaseURL: "https://smart-eae3a-default-rtdb.firebaseio.com",
  projectId: "smart-eae3a",
  storageBucket: "smart-eae3a.firebasestorage.app",
  messagingSenderId: "501344504101",
  appId: "1:501344504101:web:ad1f3c08730a8aff5972cc",
  measurementId: "G-1QTGC2RXW9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
