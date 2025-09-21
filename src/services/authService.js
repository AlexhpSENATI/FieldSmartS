// src/services/authService.js
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { ref, set, get, update } from "firebase/database";

// Proveedor de Google
const googleProvider = new GoogleAuthProvider();

//  REGISTRAR usuario con rol
export async function registerUser(name, email, password, role = "user") {
  try {
    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error("Email y contraseña deben ser texto válido.");
    }

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

//  LOGIN con email y password
export async function loginUser(email, password) {
  try {
    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error("Email y contraseña deben ser texto válido.");
    }

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

// 🔹 LOGIN con Google
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Verificar si ya está en la BD
    const snapshot = await get(ref(db, "users/" + user.uid));
    if (!snapshot.exists()) {
      // Guardar nuevo usuario con rol por defecto
      await set(ref(db, "users/" + user.uid), {
        name: user.displayName || "",
        email: user.email,
        role: "user",
      });
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

//  LOGOUT
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

//  CAMBIAR rol de un usuario
export async function changeUserRole(userId, newRole) {
  try {
    const userRef = ref(db, "users/" + userId);
    await update(userRef, { role: newRole });

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}


// src/services/authService.js



// import { auth, db } from "../firebase";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut
// } from "firebase/auth";
// import { ref, set, get, update } from "firebase/database"; // 👈 agregamos update

// // Registrar usuario con rol
// export async function registerUser(name, email, password, role = "user") {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // Guardamos datos en la BD
//     await set(ref(db, "users/" + user.uid), {
//       name,
//       email,
//       role,
//     });

//     return { success: true, user };
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// }

// // Iniciar sesión
// export async function loginUser(email, password) {
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // Buscar rol en la BD
//     const snapshot = await get(ref(db, "users/" + user.uid));
//     const data = snapshot.val();

//     return {
//       success: true,
//       user: { ...user, role: data?.role || "user", name: data?.name || "" }
//     };
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// }

// // Cerrar sesión
// export async function logoutUser() {
//   try {
//     await signOut(auth);
//     return { success: true };
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// }

// // 🔥 Cambiar rol de un usuario
// export async function changeUserRole(userId, newRole) {
//   try {
//     const userRef = ref(db, "users/" + userId);
//     await update(userRef, { role: newRole });

//     return { success: true };
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// }


