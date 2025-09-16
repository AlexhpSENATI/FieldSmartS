// src/context/EstadisticasContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

export const EstadisticasContext = createContext();

export const EstadisticasProvider = ({ children }) => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const datosRef = ref(db, "historial"); // la misma ruta que usas en AppContext
    onValue(datosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convertimos objeto en array para gráficas
        const arr = Object.values(data);
        setDatos(arr);
      }
    });
  }, []);

  return (
    <EstadisticasContext.Provider value={{ datos }}>
      {children}
    </EstadisticasContext.Provider>
  );
};
