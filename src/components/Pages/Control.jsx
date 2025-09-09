// src/components/Tabs/Control.jsx
import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const ControlTab = () => {
  const { controlarBomba, cambiarModo, actualizarUmbral } = useContext(AppContext);
  const [modoAutomatico, setModoAutomatico] = useState("false");
  const [umbralHumedad, setUmbralHumedad] = useState(40);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>Panel de Control</h2>

      <div className="cards-grid">
        {/* Control Manual */}
        <div className="card">
          <h3>⚡ Control Manual de Bomba</h3>
          <button className="btn success" onClick={() => controlarBomba(true)}>
            🟢 Encender
          </button>
          <button className="btn danger" onClick={() => controlarBomba(false)}>
            🔴 Apagar
          </button>
        </div>

        {/* Modo Automático */}
        <div className="card">
          <h3>🤖 Modo de Operación</h3>
          <div className="form-group">
            <label>Modo Automático:</label>
            <select
              value={modoAutomatico}
              onChange={(e) => setModoAutomatico(e.target.value)}
            >
              <option value="true">Activado</option>
              <option value="false">Desactivado</option>
            </select>
          </div>
          <button
            className="btn"
            onClick={() => cambiarModo(modoAutomatico === "true")}
          >
            🔄 Cambiar Modo
          </button>
        </div>

        {/* Configuración */}
        <div className="card">
          <h3>⚙️ Configuración de Riego</h3>
          <div className="form-group">
            <label>Humedad mínima (%):</label>
            <input
              type="number"
              min="0"
              max="100"
              value={umbralHumedad}
              onChange={(e) => setUmbralHumedad(e.target.value)}
            />
          </div>
          <button className="btn warning" onClick={() => actualizarUmbral(umbralHumedad)}>
            💾 Guardar Umbral
          </button>
        </div>
      </div>

      {/* Estilos rápidos */}
      {/* <style>{`
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
        select, input {
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
        }
        .btn.success {
          background: #2ecc71;
          color: white;
        }
        .btn.success:hover {
          background: #27ae60;
        }
        .btn.danger {
          background: #e74c3c;
          color: white;
          margin-left: 0.5rem;
        }
        .btn.danger:hover {
          background: #c0392b;
        }
        .btn.warning {
          background: #f39c12;
          color: white;
        }
        .btn.warning:hover {
          background: #d35400;
        }
      `}</style> */}
    </div>
  );
};

export default ControlTab;
