// src/components/Tabs/Control.jsx
import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
// import "../../styles/Dashboard.css";
import "../../styles/Control.css";


const ControlTab = () => {
  const { controlarBomba, cambiarModo, actualizarUmbral } = useContext(AppContext);

  const [modoAutomatico, setModoAutomatico] = useState("false");
  const [umbralHumedad, setUmbralHumedad] = useState(40);
  const [estadoBomba, setEstadoBomba] = useState(false);

  return (
    <div >
      <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#2c3e50", marginBottom: "1.5rem" }}>Panel de Control</h2>

      <div className="control-cards-grid">
        {/* Control Manual */}
        <div className="control-card">
          <div className="card-header">
            <div className="icon-fondo">
              <div className="icon-container">
                <img src="../public/icons/control/control.png" alt="Pump" />
              </div>
            </div>

            <span className={`status-badge ${estadoBomba ? "on" : "off"}`}>
              {estadoBomba ? "ON" : "OFF"}
            </span>
          </div>
          <h3>
            CONTROL MANUAL <br /> DE BOMBA
          </h3>
          <p className="label-text">Modo Manual:</p>

          <div className="button-groupxd">
            <button
              className="control-btn successxd"
              onClick={() => {
                controlarBomba(true);
                setEstadoBomba(true);
              }}
            >
              ENCENDER
            </button>
            <button
              className="control-btn dangerxd"
              onClick={() => {
                controlarBomba(false);
                setEstadoBomba(false);
              }}
            >
              APAGAR
            </button>
          </div>
        </div>

        {/* Modo Automático */}
        <div className="control-card">
          <div className="card-header">
            <div className="icon-fondo">
              <div className="icon-container">
                <img src="../public/icons/control/modo.png" alt="Automation" />
              </div>
            </div>

            <span
              className={`status-badge ${modoAutomatico === "true" ? "on" : "off"
                }`}
            >
              {modoAutomatico === "true" ? "Activado" : "Desactivado"}
            </span>
          </div>
          <h3>MODO DE OPERACION <br /> OPCIONAL</h3>

          <p className="label-text">Modo Automático:</p>
          <div className="form-row">
            <select
              value={modoAutomatico}
              onChange={(e) => setModoAutomatico(e.target.value)}
              className="control-select"
            >
              <option value="false">Desactivado</option>
              <option value="true">Activado</option>
            </select>
            <button
              className="control-btn success"
              onClick={() => cambiarModo(modoAutomatico === "true")}
            >
              CAMBIAR
            </button>
          </div>
        </div>

        {/* Configuración */}
        <div className="control-card">
          <div className="card-header">
            <div className="icon-fondo">
              <div className="icon-container">
                <img src="../public/icons/control/agua.png" alt="Config" />
              </div>
            </div>

          </div>
          <h3>CONFIGURACION DE RIEGO</h3>
          <p className="label-text">Humedad Mínima (%):</p>
          <div className="form-row">
            <input
              type="number"
              min="0"
              max="100"
              value={umbralHumedad}
              onChange={(e) => setUmbralHumedad(e.target.value)}
              className="control-select"
            />
            <button
              className="control-btn success"
              onClick={() => actualizarUmbral(umbralHumedad)}
            >
              GUARDAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlTab;


// // src/components/Tabs/Control.jsx
// import React, { useState, useContext } from "react";
// import { AppContext } from "../../context/AppContext";

// const ControlTab = () => {
//   const { controlarBomba, cambiarModo, actualizarUmbral } = useContext(AppContext);
//   const [modoAutomatico, setModoAutomatico] = useState("false");
//   const [umbralHumedad, setUmbralHumedad] = useState(40);

//   return (
//     <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
//       <h2>Panel de Control</h2>

//       <div className="control-cards-grid">
//         {/* Control Manual */}
//         <div className="control-card">
//           <h3>⚡ Control Manual de Bomba</h3>
//           <button className="control-btn success" onClick={() => controlarBomba(true)}>
//             🟢 Encender
//           </button>
//           <button className="control-btn danger" onClick={() => controlarBomba(false)}>
//             🔴 Apagar
//           </button>
//         </div>

//         {/* Modo Automático */}
//         <div className="control-card">
//           <h3>🤖 Modo de Operación</h3>
//           <div className="control-form-group">
//             <label>Modo Automático:</label>
//             <select
//               value={modoAutomatico}
//               onChange={(e) => setModoAutomatico(e.target.value)}
//               className="control-select"
//             >
//               <option value="true">Activado</option>
//               <option value="false">Desactivado</option>
//             </select>
//           </div>
//           <button
//             className="control-btn"
//             onClick={() => cambiarModo(modoAutomatico === "true")}
//           >
//             🔄 Cambiar Modo
//           </button>
//         </div>

//         {/* Configuración */}
//         <div className="control-card">
//           <h3>⚙️ Configuración de Riego</h3>
//           <div className="control-form-group">
//             <label>Humedad mínima (%):</label>
//             <input
//               type="number"
//               min="0"
//               max="100"
//               value={umbralHumedad}
//               onChange={(e) => setUmbralHumedad(e.target.value)}
//               className="control-input-number"
//             />
//           </div>
//           <button
//             className="control-btn warning"
//             onClick={() => actualizarUmbral(umbralHumedad)}
//           >
//             💾 Guardar Umbral
//           </button>
//         </div>
//       </div>

//       {/* Estilos internos */}
//       <style>{`
//         .control-cards-grid {
//           display: flex;
//           gap: 1rem;
//           flex-wrap: wrap;
//         }

//         .control-card {
//           background-color: #f9f9f9;
//           border-radius: 10px;
//           box-shadow: 0 2px 6px rgba(0,0,0,0.1);
//           padding: 1rem;
//           flex: 1 1 300px;
//           display: flex;
//           flex-direction: column;
//           gap: 1rem;
//         }

//         .control-card h3 {
//           margin-bottom: 0.5rem;
//           font-size: 1.1rem;
//         }

//         .control-form-group {
//           display: flex;
//           flex-direction: column;
//           gap: 0.3rem;
//         }

//         .control-input-number, .control-select {
//           padding: 0.4rem 0.6rem;
//           border: 1px solid #ccc;
//           border-radius: 6px;
//           width: 100%;
//           font-size: 1rem;
//         }

//         .control-btn {
//           padding: 0.5rem 1rem;
//           background-color: #4caf50;
//           color: white;
//           border: none;
//           border-radius: 6px;
//           cursor: pointer;
//           font-size: 0.95rem;
//           transition: background-color 0.2s;
//         }

//         .control-btn:hover {
//           background-color: #45a049;
//         }

//         .control-btn.warning {
//           background-color: #f44336;
//         }

//         .control-btn.warning:hover {
//           background-color: #d32f2f;
//         }

//         .control-btn.success {
//           background-color: #4caf50;
//         }

//         .control-btn.success:hover {
//           background-color: #45a049;
//         }

//         .control-btn.danger {
//           background-color: #f44336;
//         }

//         .control-btn.danger:hover {
//           background-color: #d32f2f;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ControlTab;
