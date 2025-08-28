// src/components/Tabs/Logs.jsx
import React, { useContext, useEffect, useRef } from "react";
import { AppContext } from "../../context/AppContext";

const Logs = () => {
  const { logs, limpiarLogs } = useContext(AppContext);
  const logRef = useRef(null);

  // Auto-scroll al último log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>📜 Registro de Actividades</h2>

      <div className="card">
        <h3>Log en Tiempo Real</h3>
        <div className="log-container" ref={logRef}>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="log-entry">
                {log}
              </div>
            ))
          ) : (
            <p className="no-logs">No hay registros disponibles.</p>
          )}
        </div>

        <button className="btn danger" onClick={limpiarLogs}>
          🗑️ Limpiar Logs
        </button>
      </div>
    </div>
  );
};

export default Logs;
