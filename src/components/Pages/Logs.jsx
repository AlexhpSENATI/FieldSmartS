// src/components/Tabs/Logs.jsx
import React, { useContext, useEffect, useRef } from "react";
import { AppContext } from "../../context/AppContext";
import "../../styles/Logs.css";
const Logs = () => {
  const { logs, limpiarLogs } = useContext(AppContext);
  const logRef = useRef(null);

  // Auto-scroll al último log con comportamiento suave
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTo({
        top: logRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs]);

  return (
    <div className="terminal-container">

      <div className="terminal-card">
        {/* Barra de título estilo terminal */}
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="button close"></span>
            <span className="button minimize"></span>
            <span className="button maximize"></span>
          </div>
          <div className="terminal-title">activity.log</div>
        </div>

        {/* Área de logs */}
        <div className="terminal-body" ref={logRef}>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="log-entry">
                <span className="prefix">❯</span> {log}
              </div>
            ))
          ) : (
            <p className="no-logs">No hay registros disponibles. Esperando actividad...</p>
          )}
          {/* Cursor parpadeante al final */}
          <div className="cursor">█</div>
        </div>

        {/* Botón de limpiar con estilo terminal */}
        <div className="terminal-footer">
          <button className="btn-clear" onClick={limpiarLogs} title="Limpiar terminal">
            <i className="bi bi-trash"></i> Limpiar Logs
          </button>

        </div>
      </div>
    </div>
  );
};

export default Logs;