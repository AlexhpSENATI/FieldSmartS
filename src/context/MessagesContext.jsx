import React, { createContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue, push, update, remove } from "firebase/database";

export const MessagesContext = createContext();

export const MessagesProvider = ({ children }) => {
  const [mensajes, setMensajes] = useState([]);
  const [noLeidos, setNoLeidos] = useState(0);

  // Escucha en tiempo real los mensajes en Firebase
  useEffect(() => {
    const mensajesRef = ref(db, "mensajes");

    const listener = onValue(mensajesRef, (snapshot) => {
      const data = snapshot.val();
      const lista = data
        ? Object.entries(data).map(([id, msg]) => ({ id, ...msg }))
        : [];
      lista.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setMensajes(lista);
      setNoLeidos(lista.filter((msg) => !msg.leido).length);
    });

    // Forzar re-render al volver a la pestaña
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setNoLeidos((prev) => prev + 0);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      listener(); // desconecta listener
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Funciones para manipular mensajes
  const agregarMensaje = (mensaje) => push(ref(db, "mensajes"), mensaje);
  const marcarLeido = (id) => update(ref(db, `mensajes/${id}`), { leido: true });
  const borrarMensaje = (id) => remove(ref(db, `mensajes/${id}`));
  const borrarTodos = () => mensajes.forEach((msg) => remove(ref(db, `mensajes/${msg.id}`)));

  return (
    <MessagesContext.Provider
      value={{
        mensajes,
        noLeidos,
        agregarMensaje,
        marcarLeido,
        borrarMensaje,
        borrarTodos,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
