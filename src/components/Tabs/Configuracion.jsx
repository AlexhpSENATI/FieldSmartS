// Configuracion.jsx
import React from "react";

const Configuracion = ({ actualizarIntervalo, limpiarHistorial, exportarDatos }) => {
  return (
    <div id="config" className="tab-content">
      <h2>Configuración del Sistema</h2>
      <div className="control-section">
        <div className="control-grid">
          <div className="control-group">
            <div className="control-title">
              <span>🔧</span>
              Configuración de Actualización
            </div>
            <div className="form-group">
              <label className="form-label">Intervalo de actualización (segundos):</label>
              <input
                type="number"
                className="form-input"
                id="intervalo-actualizacion"
                min="1"
                max="60"
                defaultValue="2"
              />
            </div>
            <button className="btn" onClick={actualizarIntervalo}>
              <span>⏱️</span> Aplicar Intervalo
            </button>
          </div>

          <div className="control-group">
            <div className="control-title">
              <span>📊</span>
              Configuración de Datos
            </div>
            <button className="btn warning" onClick={limpiarHistorial}>
              <span>🗑️</span> Limpiar Historial
            </button>
            <button className="btn" onClick={exportarDatos}>
              <span>📥</span> Exportar Datos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;