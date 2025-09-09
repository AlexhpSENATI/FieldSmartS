// src/components/Tabs/Configuracion.jsx
import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Configuracion = () => {
  const { actualizarIntervalo, limpiarHistorial, exportarDatos } = useContext(AppContext);
  const [intervalo, setIntervalo] = useState(2);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>⚙️ Configuración del Sistema</h2>

      <div className="confi-cards-grid">
        {/* Intervalo de actualización */}
        <div className="confi-card">
          <h3>🔧 Configuración de Actualización</h3>
          <div className="confi-form-group">
            <label>Intervalo (segundos):</label>
            <input
              type="number"
              min="1"
              max="60"
              value={intervalo}
              onChange={(e) => setIntervalo(e.target.value)}
              className="confi-input-number"
            />
          </div>
          <button className="confi-btn" onClick={() => actualizarIntervalo(intervalo)}>
            ⏱️ Aplicar Intervalo
          </button>
        </div>

        {/* Configuración de datos */}
        <div className="confi-card">
          <h3>📊 Configuración de Datos</h3>
          <button className="confi-btn warning" onClick={limpiarHistorial}>
            🗑️ Limpiar Historial
          </button>
          <button className="confi-btn" onClick={exportarDatos}>
            📥 Exportar Datos
          </button>
        </div>
      </div>

      {/* Estilos internos para este componente */}
      <style>{`
        .confi-cards-grid {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .confi-card {
          background-color: #f9f9f9;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          padding: 1rem;
          flex: 1 1 300px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .confi-card h3 {
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .confi-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .confi-input-number {
          padding: 0.4rem 0.6rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          width: 100%;
          font-size: 1rem;
        }

        .confi-btn {
          padding: 0.5rem 1rem;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: background-color 0.2s;
        }

        .confi-btn:hover {
          background-color: #45a049;
        }

        .confi-btn.warning {
          background-color: #f44336;
        }

        .confi-btn.warning:hover {
          background-color: #d32f2f;
        }
      `}</style>
    </div>
  );
};

export default Configuracion;
