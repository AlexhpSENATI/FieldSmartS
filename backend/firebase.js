// backend/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBYGDzJvJqzg8MhNCcqkGVvjrGdAQ2cCkQ",
  authDomain: "field-47909.firebaseapp.com",
  databaseURL: "https://field-47909-default-rtdb.firebaseio.com",
  projectId: "field-47909",
  storageBucket: "field-47909.firebasestorage.app",
  messagingSenderId: "221938376418",
  appId: "1:221938376418:web:4893bda21a0bd47ad248bb",
  measurementId: "G-7H7SL4Y26H"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
