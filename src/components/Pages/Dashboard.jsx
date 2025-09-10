// src/components/Tabs/Dashboard.jsx
import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "../../styles/Dashboard.css";

const Dashboard = () => {
  const {
    datos,
    connected,
    espIP,
    setEspIP,
    espPort,
    setEspPort,
    handleConnect,
    desconectarESP,
  } = useContext(AppContext);

  return (
    <>


      <div className="dash-container">
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#2c3e50", marginBottom: "1.5rem" }}>Panel de Control</h2>

        {/* Conexión */}
        <div className="dash-card dash-connection-card">
          <h3>CONEXIÓN ESP8266</h3>
          <div className="dash-form-row">
            <div className="dash-form-group">
              <label>IP:</label>
              <input
                type="text"
                value={espIP}
                onChange={(e) => setEspIP(e.target.value)}
                placeholder="192.168.0.40"
                className="dash-input-text"
              />
            </div>
            <div className="dash-form-group">
              <label>Puerto:</label>
              <input
                type="text"
                value={espPort}
                onChange={(e) => setEspPort(e.target.value)}
                placeholder="80"
                className="dash-input-text"
              />
            </div>
            <div className="dash-btn-group">
              <button className="dash-btn dash-btn-primary" onClick={handleConnect}>Conectar</button>
              <button className="dash-btn dash-btn-secondary" onClick={desconectarESP}>Desconectar</button>
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="dash-cards-grid">
          {/* Temperatura */}
          <div className="dash-card dash-metric-card">
            <div className="dash-metric-icon">
              <img
                src="../public/icons/temperatura.png"
                alt="Temperatura"
                style={{ width: "74px", height: "74px" }}
              />
            </div>
            <div>
              <p className="dash-metric-value">
                {datos.temperatura != null ? `${datos.temperatura.toFixed(1)}°C` : "--"}
              </p>
              <p className="dash-metric-label">Temperatura</p>
            </div>
          </div>

          {/* Humedad Ambiental */}
          <div className="dash-card dash-metric-card">
            <div className="dash-metric-icon">
              <img
                src="../public/icons/ambiente.png"
                alt="Humedad"
                style={{ width: "74px", height: "74px" }}
              />
            </div>
            <div>
              <p className="dash-metric-value">
                {datos.humedadAmbiental != null ? `${datos.humedadAmbiental.toFixed(1)}%` : "--"}
              </p>
              <p className="dash-metric-label">Humedad Ambiental</p>
            </div>
          </div>

          {/* Temperatura */}
          {/* <div className="dash-card dash-metric-card">
            <div className="dash-metric-icon">
              <img src="../public/icons/temperatura.png" alt="Temperatura" style={{ width: "74px", height: "74px" }} />
            </div>
            <div>
              <p className="dash-metric-value">{datos.temperatura !== undefined ? `${datos.temperatura.toFixed(1)}°C` : "--"}</p>
              <p className="dash-metric-label">Temperatura</p>
            </div>
          </div> */}

          {/* Humedad Ambiental */}
          {/* <div className="dash-card dash-metric-card">
            <div className="dash-metric-icon">
              <img src="../public/icons/ambiente.png" alt="Humedad" style={{ width: "74px", height: "74px" }} />
            </div>
            <div>
              <p className="dash-metric-value">{datos.humedadAmbiental !== undefined ? `${datos.humedadAmbiental.toFixed(1)}%` : "--"}</p>
              <p className="dash-metric-label">Humedad Ambiental</p>
            </div>
          </div> */}

          {/* Humedad del Suelo */}
          <div className="dash-card dash-metric-card">
            <div className="dash-metric-icon">
              <img src="../public/icons/humedad.png" alt="Suelo" style={{ width: "74px", height: "74px" }} />
            </div>
            <div>
              <p className="dash-metric-value">{datos.humedad !== undefined ? `${datos.humedad}%` : "--"}</p>
              <p className="dash-metric-label">Humedad del Suelo</p>
            </div>
          </div>

          {/* Bomba de Agua */}
          <div className="dash-card dash-metric-card">
            <div className="dash-metric-icon">
              <img src="../public/icons/bomba.png" alt="Bomba" style={{ width: "74px", height: "74px" }} />
            </div>
            <div>
              <p className="dash-metric-value">{datos.bomba ? "ENCENDIDA" : "APAGADA"}</p>
              <p className="dash-metric-label">Bomba de Agua</p>
            </div>
          </div>

          {/* Modo Automático */}
          <div className="dash-card dash-metric-card">
            <div className="dash-metric-icon">
              <img src="../public/icons/sistema.png" alt="Modo" style={{ width: "74px", height: "74px" }} />
            </div>
            <div>
              <p className="dash-metric-value">{datos.automatico ? "ACTIVADO" : "DESACTIVADO"}</p>
              <p className="dash-metric-label">Modo Automático</p>
            </div>
          </div>

          {/* Estado de Conexión */}
          <div className="dash-card dash-metric-card">
            <div className="dash-metric-icon">
              <img src="../public/icons/activo.png" alt="Conexión" style={{ width: "74px", height: "74px" }} />
            </div>
            <div>
              <p className="dash-metric-value">{connected ? "CONECTADO" : "DESCONECTADO"}</p>
              <p className="dash-metric-label">Sistema</p>
            </div>
          </div>
        </div>

        {/* Información Detallada - Diseño Exacto */}
        <div className="dash-detail-section">
          {/* Columna 1: Umbral & Estado de Espera */}
          <div className="dash-detail-column">
            <div className="dash-detail-item">
              <div className="dash-detail-icon">
                <img src="../public/icons/iconsdetails/humbral.png" alt="Umbral" style={{ width: "50px", height: "50px", color: "#00C75A" }} />
              </div>
              <div>
                <p className="dash-detail-label">Umbral de Humedad:</p>
                <p className="dash-detail-value">{datos.humedadMinima || "--"}%</p>
              </div>
            </div>
            <div className="dash-detail-item">
              <div className="dash-detail-icon">
                <img src="../public/icons/iconsdetails/espera.png" alt="Espera" style={{ width: "50px", height: "50px", color: "#00C75A" }} />
              </div>
              <div>
                <p className="dash-detail-label">Estado de Espera:</p>
                <p className="dash-detail-value">{datos.enEspera ? "SÍ" : "NO"}</p>
              </div>
            </div>
          </div>

          {/* Divisor vertical */}
          <div className="dash-divider"></div>

          {/* Columna 2: Tiempo Restante & Último Riego */}
          <div className="dash-detail-column">
            <div className="dash-detail-item">
              <div className="dash-detail-icon">
                <img src="../public/icons/iconsdetails/tiempo.png" alt="Tiempo" style={{ width: "50px", height: "50px", color: "#00C75A" }} />
              </div>
              <div>
                <p className="dash-detail-label">Tiempo Restante:</p>
                <p className="dash-detail-value">{datos.tiempoEsperaRestante || 0} s</p>
              </div>
            </div>
            <div className="dash-detail-item">
              <div className="dash-detail-icon">
                <img src="../public/icons/iconsdetails/espera.png" alt="Riego" style={{ width: "50px", height: "50px", color: "#00C75A" }} />
              </div>
              <div>
                <p className="dash-detail-label">Último Riego:</p>
                <p className="dash-detail-value">{datos.ultimoRiego || "--"} s</p>
              </div>
            </div>
          </div>

          {/* Divisor vertical */}
          <div className="dash-divider"></div>

          {/* Columna 3: IP & Timestamp */}
          <div className="dash-detail-column">
            <div className="dash-detail-item">
              <div className="dash-detail-icon">
                <img src="../public/icons/iconsdetails/ip.png" alt="IP" style={{ width: "50px", height: "50px", color: "#00C75A" }} />
              </div>
              <div>
                <p className="dash-detail-label">IP del ESP8266:</p>
                <p className="dash-detail-value">{espIP || "--"}</p>
              </div>
            </div>
            <div className="dash-detail-item">
              <div className="dash-detail-icon">
                <img src="../public/icons/iconsdetails/tempstap.png" alt="Timestamp" style={{ width: "50px", height: "50px", color: "#00C75A" }} />
              </div>
              <div>
                <p className="dash-detail-label">Timestamp:</p>
                <p className="dash-detail-value">{datos.timestamp || "--"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;