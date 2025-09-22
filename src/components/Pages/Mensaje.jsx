// Mensajes.jsx
import React, { useEffect, useRef, useState, useContext } from "react";
import { useAppContext } from "../../context/AppContext";
import { MessagesContext } from "../../context/MessagesContext";
import "../../styles/Mensaje.css";

const Mensajes = () => {
  const { humSuelo, currentConfig } = useAppContext();
  const { mensajes, agregarMensaje, marcarLeido, borrarMensaje, borrarTodos } = useContext(MessagesContext);
  const [filtro, setFiltro] = useState("todos");

  const estadoPrevio = useRef("normal");

  // Detectar cambios de humedad y generar mensajes automáticamente
  useEffect(() => {
    if (humSuelo === "--") return;
    if (!currentConfig.umbralMin || !currentConfig.umbralMax) return;

    const humedad = parseInt(humSuelo);
    let estadoActual = "normal";

    if (humedad < currentConfig.umbralMin) estadoActual = "bajo";
    else if (humedad > currentConfig.umbralMax) estadoActual = "alto";

    if (estadoActual !== estadoPrevio.current) {
      let nuevoMensaje = {};

      if (estadoActual === "bajo") {
        nuevoMensaje = {
          texto: `Humedad BAJA (${humedad}%) por debajo del umbral mínimo (${currentConfig.umbralMin}%)`,
          fecha: new Date().toLocaleString(),
          leido: false,
          tipo: "alerta",
          icono: "⚠️"
        };
      } else if (estadoActual === "alto") {
        nuevoMensaje = {
          texto: `Humedad ALTA (${humedad}%) por encima del umbral máximo (${currentConfig.umbralMax}%)`,
          fecha: new Date().toLocaleString(),
          leido: false,
          tipo: "advertencia",
          icono: "📈"
        };
      } else {
        nuevoMensaje = {
          texto: `Humedad NORMAL (${humedad}%) dentro de los umbrales`,
          fecha: new Date().toLocaleString(),
          leido: false,
          tipo: "exito",
          icono: "✅"
        };
      }

      agregarMensaje(nuevoMensaje);
    }

    estadoPrevio.current = estadoActual;
  }, [humSuelo, currentConfig, agregarMensaje]);

  // Filtrar mensajes según selección
  const mensajesFiltrados = mensajes.filter(msg => {
    if (filtro === "todos") return true;
    if (filtro === "no-leidos") return !msg.leido;
    if (filtro === "alertas") return msg.tipo === "alerta";
    if (filtro === "advertencias") return msg.tipo === "advertencia";
    if (filtro === "exitos") return msg.tipo === "exito";
    return true;
  });

  return (
    <div className="mensajes-container">
      <div className="mensajes-header">
        <h2>Mensajes del Sistema</h2>
      </div>

      <div className="controles-mensajes">
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="filtro-select"
        >
          <option value="todos">Todos los mensajes</option>
          <option value="no-leidos">No leídos</option>
          <option value="alertas">Alertas</option>
          <option value="advertencias">Advertencias</option>
          <option value="exitos">Éxitos</option>
        </select>

        <button
          onClick={borrarTodos}
          className="btn-borrar-todos"
          disabled={mensajes.length === 0}
        >
          <i className="bi bi-trash3"></i> Borrar todos
        </button>
      </div>

      <br />

      {mensajesFiltrados.length === 0 ? (
        <div className="sin-mensajes">
          <div className="icono-sin-mensajes"><i className="bi bi-send-arrow-down"></i></div>
          <p>No hay mensajes {filtro !== "todos" ? `con el filtro "${filtro}"` : ""}</p>
        </div>
      ) : (
        <div className="lista-mensajes">
          {mensajesFiltrados.map(msg => (
            <div
              key={msg.id}
              className={`mensaje ${msg.tipo || "normal"} ${msg.leido ? "leido" : "no-leido"}`}
            >
              <div className="mensaje-icono">
                {msg.icono || (msg.tipo === "alerta" ? "⚠️" : msg.tipo === "advertencia" ? "📈" : "✅")}
              </div>

              <div className="mensaje-contenido">
                <div className="mensaje-texto">{msg.texto}</div>
                <div className="mensaje-fecha">{msg.fecha}</div>
                <div className="mensaje-acciones">
                  {!msg.leido && (
                    <button
                      onClick={() => marcarLeido(msg.id)}
                      className="btn-marcar-leido"
                    >
                      <i className="bi bi-check2-all"></i> Marcar como leído
                    </button>
                  )}
                  <button
                    onClick={() => borrarMensaje(msg.id)}
                    className="btn-borrar"
                  >
                    <i className="bi bi-trash3"></i> Eliminar
                  </button>
                </div>
              </div>

              {!msg.leido && <div className="indicador-no-leido"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mensajes;
