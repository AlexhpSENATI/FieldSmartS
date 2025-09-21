// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBjk9jRybbEHh21Biz-jXkWjFnJFZQb0SU",
  authDomain: "aplicativo2-43c08.firebaseapp.com",
  databaseURL: "https://aplicativo2-43c08-default-rtdb.firebaseio.com",
  projectId: "aplicativo2-43c08",
  storageBucket: "aplicativo2-43c08.firebasestorage.app",
  messagingSenderId: "222100498306",
  appId: "1:222100498306:web:3eebd9f073d16cac9ad19b",
  measurementId: "G-HT6670K2VD"
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