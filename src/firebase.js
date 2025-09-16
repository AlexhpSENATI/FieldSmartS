// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDzb3fm9tD3fYCpp0bAukLs7IMWm2HVVSQ",
  authDomain: "smart-5a03f.firebaseapp.com",
  databaseURL: "https://smart-5a03f-default-rtdb.firebaseio.com",
  projectId: "smart-5a03f",
  storageBucket: "smart-5a03f.firebasestorage.app",
  messagingSenderId: "125147955298",
  appId: "1:125147955298:web:3025508b40e6feeea4113b",
  measurementId: "G-YLTJDCR9SC"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

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