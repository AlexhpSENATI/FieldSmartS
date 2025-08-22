import React from "react";

function Logs() {
  return (
    <div className="tab-content">
      <h2>Registro de Actividades</h2>
      <div className="control-section">
        <h3>Log en Tiempo Real</h3>
        <div className="log-container" id="log-container">
          <div className="log-entry">Sistema iniciado. Esperando conexión...</div>
        </div>
        <button className="btn" onClick={() => window.limpiarLogs()} style={{ marginTop: "15px" }}>
          🗑️ Limpiar Logs
        </button>
      </div>
    </div>
  );
}

export default Logs;
