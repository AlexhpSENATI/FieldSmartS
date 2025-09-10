// src/components/Tabs/Configuracion.jsx
import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "../../styles/Configuracion.css";

const Configuracion = () => {
  const { actualizarIntervalo, limpiarHistorial, exportarDatos } = useContext(AppContext);
  const [intervalo, setIntervalo] = useState(2);

  return (
    <div >
      <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#2c3e50", marginBottom: "1.5rem" }}>Panel de Control</h2>

      <div className="confi-cards-grid">
        {/* Intervalo de actualización */}
        <div className="confi-card">
          <div className="confi-card-header">
            <div className="icon-fondo">
              <div className="icon-container">
                <img src="../public/icons/control/control.png" alt="Pump" />
              </div>
            </div>
          </div>


          <h3>CONFIGURACION DE <br />ACTUALIZACION</h3>
          <p className="label-text">Intervalo segundos:</p>
          <div className="confi-form-group">

            <input
              type="number"
              min="1"
              max="60"
              value={intervalo}
              onChange={(e) => setIntervalo(e.target.value)}
              className="confi-input-number"
            />
            <button className="confi-btn xd" onClick={() => actualizarIntervalo(intervalo)}>
              ⏱️ Aplicar Intervalo
            </button>
          </div>

        </div>

        {/* Configuración de datos */}
        <div className="confi-card">
          <div className="confi-card-header">
            <div className="icon-fondo">
              <div className="icon-container">
                <img src="../public/icons/control/control.png" alt="Pump" />
              </div>
            </div>
          </div>

          <h3>CONFIGURACION DE <br /> HISTORIAL</h3>
          <p className="label-text">Importar y limpiar:</p>

          <div className="confi-btn-group">
            <button className="confi-btn dangerxd" onClick={limpiarHistorial}>
              Limpiar Historial
            </button>
            <button className="confi-btn xd" onClick={exportarDatos}>
              Exportar Datos
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Configuracion;
