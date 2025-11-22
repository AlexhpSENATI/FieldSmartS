// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCqRzGN4jMrz0rZXwWBDpasvh1zddedStc",
  authDomain: "fieldsmartapp-659ad.firebaseapp.com",
  databaseURL: "https://fieldsmartapp-659ad-default-rtdb.firebaseio.com",
  projectId: "fieldsmartapp-659ad",
  storageBucket: "fieldsmartapp-659ad.firebasestorage.app",
  messagingSenderId: "642293255398",
  appId: "1:642293255398:web:291a0df39138be33d07f27",
  measurementId: "G-Q2V19K25GN"
};
// const firebaseConfig = {
//   apiKey: "AIzaSyBYGDzJvJqzg8MhNCcqkGVvjrGdAQ2cCkQ",
//   authDomain: "field-47909.firebaseapp.com",
//   databaseURL: "https://field-47909-default-rtdb.firebaseio.com",
//   projectId: "field-47909",
//   storageBucket: "field-47909.firebasestorage.app",
//   messagingSenderId: "221938376418",
//   appId: "1:221938376418:web:4893bda21a0bd47ad248bb",
//   measurementId: "G-7H7SL4Y26H"
// };

// ===================================== Inicializar Firebase =================== //
const app = initializeApp(firebaseConfig);

// =================== Exportar la base de datos y la autenticación =================== //
export const db = getDatabase(app);
export const auth = getAuth(app);  // 👈 Ahora sí exportas auth

// // firebase.js
// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyDzb3fm9tD3fYCpp0bAukLs7IMWm2HVVSQ",
//   authDomain: "smart-5a03f.firebaseapp.com",
//   databaseURL: "https://smart-5a03f-default-rtdb.firebaseio.com",
//   projectId: "smart-5a03f",
//   storageBucket: "smart-5a03f.firebasestorage.app",
//   messagingSenderId: "125147955298",
//   appId: "1:125147955298:web:3025508b40e6feeea4113b",
//   measurementId: "G-YLTJDCR9SC"
// };

// const app = initializeApp(firebaseConfig);
// export const db = getDatabase(app);

// // firebase.js
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
// import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyDzb3fm9tD3fYCpp0bAukLs7IMWm2HVVSQ",
//   authDomain: "smart-5a03f.firebaseapp.com",
//   databaseURL: "https://smart-5a03f-default-rtdb.firebaseio.com",
//   projectId: "smart-5a03f",
//   storageBucket: "smart-5a03f.firebasestorage.app",
//   messagingSenderId: "125147955298",
//   appId: "1:125147955298:web:3025508b40e6feeea4113b",
//   measurementId: "G-YLTJDCR9SC"
// };
// const app = initializeApp(firebaseConfig);
// export const db = getDatabase(app);
// export { firebaseConfig }; // Export config if needed elsewhere