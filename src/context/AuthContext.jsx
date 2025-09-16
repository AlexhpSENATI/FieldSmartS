import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, setCurrentUser, clearCurrentUser } from "../storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = getCurrentUser();
    if (saved) setUser(saved);
  }, []);

  function login(user) {
    setCurrentUser(user);
    setUser(user);
  }

  function logout() {
    clearCurrentUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
