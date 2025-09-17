// src/services/authService.js
import { auth, db } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { ref, set, get, update } from "firebase/database"; // 👈 agregamos update

// Registrar usuario con rol
export async function registerUser(name, email, password, role = "user") {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Guardamos datos en la BD
    await set(ref(db, "users/" + user.uid), {
      name,
      email,
      role,
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Iniciar sesión
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Buscar rol en la BD
    const snapshot = await get(ref(db, "users/" + user.uid));
    const data = snapshot.val();

    return { 
      success: true, 
      user: { ...user, role: data?.role || "user", name: data?.name || "" } 
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Cerrar sesión
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// 🔥 Cambiar rol de un usuario
export async function changeUserRole(userId, newRole) {
  try {
    const userRef = ref(db, "users/" + userId);
    await update(userRef, { role: newRole });

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}


// import {
//     signInAnonymously,
//     createUserWithEmailAndPassword,
//     signInWithEmailAndPassword,
//     signOut
// } from "firebase/auth";
// import { ref, set } from "firebase/database";
// import { auth, db } from "../firebase";

// //========================LOGIN ANONIMO DE PRUEBA ========================//
// export async function loginAnonimo() {
//     try {
//         const userCredential = await signInAnonymously(auth);
//         return { success: true, user: userCredential.user };
//     } catch (error) {
//         return { success: false, message: error.message };
//     }
// }

// //========================REGISTRO CON EMAIL Y CONTRASEÑA========================//
// export async function registerUser(name, email, password) {
//     try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

// //====================Guardar datos adicionales en Realtime Database========================//
//         await set(ref(db, "users/" + user.uid), {
//             name,
//             email,
//         });

//         return { success: true, user };
//     } catch (error) {
//         return { success: false, message: error.message };
//     }
// }

// //========================LOGIN CON EMAIL Y CONTRASEÑA========================//
// export async function loginUser(email, password) {
//     try {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         return { success: true, user: userCredential.user };
//     } catch (error) {
//         return { success: false, message: error.message };
//     }
// }

// // ========================LOGOUT========================//
// export async function logoutUser() {
//     try {
//         await signOut(auth);
//         return { success: true };
//     } catch (error) {
//         return { success: false, message: error.message };
//     }
// }
