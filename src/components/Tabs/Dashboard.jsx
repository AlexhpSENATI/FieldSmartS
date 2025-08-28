// src/components/Tabs/Dashboard.jsx
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

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

  let sueloBarColor = '#2ecc71';
  if (datos.humedad !== undefined) {
    if (datos.humedad < 30) {
      sueloBarColor = '#e74c3c';
    } else if (datos.humedad < 60) {
      sueloBarColor = '#f39c12';
    }
  }

  return (
    <div className="tab-content">
      <div className="control-section">
        <h3>Conexión ESP8266</h3>
        <div className="control-grid">
          <div className="control-group">
            <div className="form-group">
              <label className="form-label">IP del ESP8266:</label>
              <input
                type="text"
                className="form-input"
                value={espIP}
                onChange={(e) => setEspIP(e.target.value)}
                placeholder="192.168.1.100"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Puerto:</label>
              <input
                type="text"
                className="form-input"
                value={espPort}
                onChange={(e) => setEspPort(e.target.value)}
                placeholder="80"
              />
            </div>
            <button className="btn success" onClick={handleConnect}>
              Conectar
            </button>
            <button className="btn danger" onClick={desconectarESP}>
              Desconectar
            </button>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card card-temperature">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">🌡️</span>
              Temperatura
            </div>
          </div>
          <div className="metric-value">
            {datos.temperatura !== undefined && !isNaN(datos.temperatura)
              ? datos.temperatura.toFixed(1) + '°C'
              : '--'}
          </div>
          <div className="metric-unit">Grados Celsius</div>
          <div className="metric-bar">
            <div
              className="metric-bar-fill"
              style={{
                width: datos.temperatura !== undefined ? Math.min(100, Math.max(0, (datos.temperatura / 50) * 100)) + '%' : '0%',
                background: '#e67e22',
              }}
            ></div>
          </div>
        </div>

        <div className="metric-card card-humidity-env">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">💨</span>
              Humedad Ambiental
            </div>
          </div>
          <div className="metric-value">
            {datos.humedadAmbiental !== undefined && !isNaN(datos.humedadAmbiental)
              ? datos.humedadAmbiental.toFixed(1) + '%'
              : '--'}
          </div>
          <div className="metric-unit">Porcentaje (%)</div>
          <div className="metric-bar">
            <div
              className="metric-bar-fill"
              style={{
                width: datos.humedadAmbiental !== undefined ? datos.humedadAmbiental + '%' : '0%',
                background: '#3498db',
              }}
            ></div>
          </div>
        </div>

        <div className="metric-card card-humidity-soil">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">🌱</span>
              Humedad del Suelo
            </div>
          </div>
          <div className="metric-value">
            {datos.humedad !== undefined ? datos.humedad + '%' : '--'}
          </div>
          <div className="metric-unit">Porcentaje (%)</div>
          <div className="metric-bar">
            <div
              className="metric-bar-fill"
              style={{
                width: datos.humedad !== undefined ? datos.humedad + '%' : '0%',
                background: sueloBarColor,
              }}
            ></div>
          </div>
        </div>

        <div className="metric-card card-pump">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">⚡</span>
              Bomba de Agua
            </div>
          </div>
          <div>
            <div className={`status-indicator ${datos.bomba ? 'status-on' : 'status-off'}`}>
              <div className="status-dot"></div>
              {datos.bomba ? 'ENCENDIDA' : 'APAGADA'}
            </div>
          </div>
          <div className="metric-unit">Estado actual</div>
        </div>

        <div className="metric-card card-mode">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">🤖</span>
              Modo Automático
            </div>
          </div>
          <div>
            <div className={`status-indicator ${datos.automatico ? 'status-on' : 'status-off'}`}>
              <div className="status-dot"></div>
              {datos.automatico ? 'ACTIVADO' : 'DESACTIVADO'}
            </div>
          </div>
          <div className="metric-unit">Control automático</div>
        </div>

        <div className="metric-card card-system">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">📡</span>
              Sistema
            </div>
          </div>
          <div>
            <div className={`status-indicator ${connected ? 'status-on' : 'status-off'}`}>
              <div className="status-dot"></div>
              {connected ? 'CONECTADO' : 'DESCONECTADO'}
            </div>
          </div>
          <div className="metric-unit">Última actualización: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      <div className="control-section">
        <h3>Información Detallada</h3>
        <div className="system-info">
          <div className="info-item">
            <span className="info-label">Umbral de Humedad:</span>
            <span className="info-value">{datos.humedadMinima || '--'} %</span>
          </div>
          <div className="info-item">
            <span className="info-label">Estado de Espera:</span>
            <span className="info-value">{datos.enEspera ? 'SÍ' : 'NO'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Tiempo Restante:</span>
            <span className="info-value">{datos.tiempoEsperaRestante || 0} s</span>
          </div>
          <div className="info-item">
            <span className="info-label">Último Riego:</span>
            <span className="info-value">{datos.ultimoRiego || '--'} s</span>
          </div>
          <div className="info-item">
            <span className="info-label">IP del ESP8266:</span>
            <span className="info-value">{espIP || '--'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Timestamp:</span>
            <span className="info-value">{datos.timestamp || '--'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;