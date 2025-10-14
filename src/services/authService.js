// src/services/authService.js
import { auth, db } from "../firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { ref, set, get, update } from "firebase/database";

// Proveedor de Google
const googleProvider = new GoogleAuthProvider();

/**
 * 🔹 Registrar usuario nuevo
 */
export async function registerUser(name, email, password, role = "user") {
  try {
    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error("Email y contraseña deben ser texto válido.");
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 🔐 Crear usuario en Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      cleanPassword
    );
    const user = userCredential.user;

    // 💾 Guardar en Realtime Database
    await set(ref(db, "users/" + user.uid), {
      name: name?.trim() || "",
      email: cleanEmail,
      role: role || "user",
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error en registerUser:", error);
    return { success: false, message: error.code || error.message };
  }
}

/**
 * 🔹 Iniciar sesión con email y contraseña
 */
export async function loginUser(email, password) {
  try {
    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error("Email y contraseña deben ser texto válido.");
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 🔐 Iniciar sesión
    const userCredential = await signInWithEmailAndPassword(
      auth,
      cleanEmail,
      cleanPassword
    );
    const user = userCredential.user;

    // 🔍 Obtener información adicional del usuario
    const snapshot = await get(ref(db, `users/${user.uid}`));
    const data = snapshot.exists() ? snapshot.val() : {};

    // ✅ Forzar que el campo email sea SIEMPRE string
    const userData = {
      uid: user.uid,
      email: typeof data.email === "string" ? data.email : cleanEmail,
      name: typeof data.name === "string" ? data.name : "",
      role: typeof data.role === "string" ? data.role : "user",
    };

    return { success: true, user: userData };
  } catch (error) {
    console.error("Error en loginUser:", error);
    return { success: false, message: error.code || error.message };
  }
}

/**
 * 🔹 Iniciar sesión con Google
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const snapshot = await get(ref(db, `users/${user.uid}`));

    // Si el usuario no existe en DB, lo creamos
    if (!snapshot.exists()) {
      await set(ref(db, "users/" + user.uid), {
        name: user.displayName || "",
        email: user.email || "",
        role: "user",
      });
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error en loginWithGoogle:", error);
    return { success: false, message: error.code || error.message };
  }
}

/**
 * 🔹 Cerrar sesión
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Error en logoutUser:", error);
    return { success: false, message: error.code || error.message };
  }
}

/**
 * 🔹 Cambiar rol del usuario
 */
export async function changeUserRole(userId, newRole) {
  try {
    const userRef = ref(db, `users/${userId}`);
    await update(userRef, { role: newRole });
    return { success: true };
  } catch (error) {
    console.error("Error en changeUserRole:", error);
    return { success: false, message: error.code || error.message };
  }
}
