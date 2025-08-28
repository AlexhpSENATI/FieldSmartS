// src/components/Tabs/Configuracion.jsx
import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Configuracion = () => {
  const { actualizarIntervalo, limpiarHistorial, exportarDatos } = useContext(AppContext);
  const [intervalo, setIntervalo] = useState(2);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>⚙️ Configuración del Sistema</h2>

      <div className="cards-grid">
        {/* Intervalo de actualización */}
        <div className="card">
          <h3>🔧 Configuración de Actualización</h3>
          <div className="form-group">
            <label>Intervalo (segundos):</label>
            <input
              type="number"
              min="1"
              max="60"
              value={intervalo}
              onChange={(e) => setIntervalo(e.target.value)}
            />
          </div>
          <button className="btn" onClick={() => actualizarIntervalo(intervalo)}>
            ⏱️ Aplicar Intervalo
          </button>
        </div>

        {/* Configuración de datos */}
        <div className="card">
          <h3>📊 Configuración de Datos</h3>
          <button className="btn warning" onClick={limpiarHistorial}>
            🗑️ Limpiar Historial
          </button>
          <button className="btn" onClick={exportarDatos}>
            📥 Exportar Datos
          </button>
        </div>
      </div>

      {/* Estilos rápidos */}
      <style>{`
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        .card {
          background: #fff;
          padding: 1rem;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .card h3 {
          margin-bottom: 0.8rem;
          font-size: 1.1rem;
        }
        .form-group {
          margin-bottom: 0.8rem;
        }
        input {
          width: 100%;
          padding: 0.4rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          margin-top: 0.3rem;
        }
        .btn {
          display: inline-block;
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.95rem;
          background: #3498db;
          color: white;
        }
        .btn:hover {
          background: #2980b9;
        }
        .btn.warning {
          background: #f39c12;
          color: white;
          margin-right: 0.5rem;
        }
        .btn.warning:hover {
          background: #d35400;
        }
      `}</style>
    </div>
  );
};

export default Configuracion;
