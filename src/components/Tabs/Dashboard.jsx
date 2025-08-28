// src/components/Tabs/Dashboard.jsx
import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";

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
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>Panel de Control</h2>

      {/* Conexión */}
      <div className="card">
        <h3>Conexión ESP8266</h3>
        <div className="form-group">
          <label>IP:</label>
          <input
            type="text"
            value={espIP}
            onChange={(e) => setEspIP(e.target.value)}
            placeholder="192.168.1.100"
          />
        </div>
        <div className="form-group">
          <label>Puerto:</label>
          <input
            type="text"
            value={espPort}
            onChange={(e) => setEspPort(e.target.value)}
            placeholder="80"
          />
        </div>
        <button onClick={handleConnect}>Conectar</button>
        <button onClick={desconectarESP} style={{ marginLeft: "0.5rem" }}>
          Desconectar
        </button>
      </div>

      {/* Métricas */}
      <div className="cards-grid">
        <div className="card">
          <h4>🌡️ Temperatura</h4>
          <p>{datos.temperatura !== undefined ? datos.temperatura.toFixed(1) + " °C" : "--"}</p>
        </div>
        <div className="card">
          <h4>💨 Humedad Ambiental</h4>
          <p>{datos.humedadAmbiental !== undefined ? datos.humedadAmbiental.toFixed(1) + "%" : "--"}</p>
        </div>
        <div className="card">
          <h4>🌱 Humedad del Suelo</h4>
          <p>{datos.humedad !== undefined ? datos.humedad + "%" : "--"}</p>
        </div>
        <div className="card">
          <h4>⚡ Bomba de Agua</h4>
          <p>{datos.bomba ? "ENCENDIDA" : "APAGADA"}</p>
        </div>
        <div className="card">
          <h4>🤖 Modo Automático</h4>
          <p>{datos.automatico ? "ACTIVADO" : "DESACTIVADO"}</p>
        </div>
        <div className="card">
          <h4>📡 Sistema</h4>
          <p>{connected ? "CONECTADO" : "DESCONECTADO"}</p>
        </div>
      </div>

      {/* Información detallada */}
      <div className="card">
        <h3>Información Detallada</h3>
        <p><strong>Umbral de Humedad:</strong> {datos.humedadMinima || "--"} %</p>
        <p><strong>Estado de Espera:</strong> {datos.enEspera ? "SÍ" : "NO"}</p>
        <p><strong>Tiempo Restante:</strong> {datos.tiempoEsperaRestante || 0} s</p>
        <p><strong>Último Riego:</strong> {datos.ultimoRiego || "--"} s</p>
        <p><strong>IP del ESP8266:</strong> {espIP || "--"}</p>
        <p><strong>Timestamp:</strong> {datos.timestamp || "--"}</p>
      </div>

      {/* Estilos rápidos */}
      <style>{`
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }
        .card {
          background: #fff;
          padding: 1rem;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .card h4, .card h3 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
        }
        .card p {
          font-size: 1rem;
          margin: 0.3rem 0;
        }
        .form-group {
          margin-bottom: 0.5rem;
        }
        input {
          padding: 0.3rem;
          margin-left: 0.5rem;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        button {
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 5px;
          background: #3498db;
          color: white;
          cursor: pointer;
        }
        button:hover {
          background: #2980b9;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
