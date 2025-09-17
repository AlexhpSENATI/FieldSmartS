import {
    signInAnonymously,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../firebase";

//========================LOGIN ANONIMO DE PRUEBA ========================//
export async function loginAnonimo() {
    try {
        const userCredential = await signInAnonymously(auth);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

//========================REGISTRO CON EMAIL Y CONTRASEÑA========================//
export async function registerUser(name, email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

//====================Guardar datos adicionales en Realtime Database========================//
        await set(ref(db, "users/" + user.uid), {
            name,
            email,
        });

        return { success: true, user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

//========================LOGIN CON EMAIL Y CONTRASEÑA========================//
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// ========================LOGOUT========================//
export async function logoutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
}
