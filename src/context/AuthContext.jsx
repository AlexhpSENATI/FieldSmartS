// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, onValue, off } from "firebase/database";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // login
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // logout
  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    let userRef; // referencia para el usuario en DB
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        userRef = ref(db, "users/" + user.uid);

        // escuchamos cambios en los datos del usuario (ej. role)
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setCurrentUser({ uid: user.uid, email: user.email, ...data });
          setLoading(false);
        });
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (userRef) off(userRef); // limpiamos el listener al desmontar
    };
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { getCurrentUser, setCurrentUser, clearCurrentUser } from "../storage";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const saved = getCurrentUser();
//     if (saved) setUser(saved);
//   }, []);

//   function login(user) {
//     setCurrentUser(user);
//     setUser(user);
//   }

//   function logout() {
//     clearCurrentUser();
//     setUser(null);
//   }

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
