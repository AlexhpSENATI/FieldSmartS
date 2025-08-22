import React from "react";

function Configuracion() {
  return (
    <div className="tab-content">
      <h2>Configuración del Sistema</h2>
      <div className="control-section">
        <div className="control-grid">
          <div className="control-group">
            <div className="control-title">🔧 Configuración de Actualización</div>
            <input type="number" className="form-input" id="intervalo-actualizacion" min="1" max="60" defaultValue="2" />
            <button className="btn" onClick={() => window.actualizarIntervalo()}>⏱️ Aplicar Intervalo</button>
          </div>

          <div className="control-group">
            <div className="control-title">📊 Configuración de Datos</div>
            <button className="btn warning" onClick={() => window.limpiarHistorial()}>🗑️ Limpiar Historial</button>
            <button className="btn" onClick={() => window.exportarDatos()}>📥 Exportar Datos</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuracion;
