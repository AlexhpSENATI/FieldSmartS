import React, { useState, useEffect, useRef } from "react";

const Dashboard = () => {
  const [espIP, setEspIP] = useState(localStorage.getItem('esp-ip') || '192.168.1.100');
  const [espPort, setEspPort] = useState(localStorage.getItem('esp-port') || '80');
  const [connected, setConnected] = useState(false);
  const [intervaloActualizacion, setIntervaloActualizacion] = useState(2000);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [datos, setDatos] = useState({
    temperatura: undefined,
    humedadAmbiental: undefined,
    humedad: undefined,
    bomba: false,
    automatico: false,
    humedadMinima: undefined,
    enEspera: false,
    tiempoEsperaRestante: 0,
    ultimoRiego: undefined,
    timestamp: undefined,
  });
  const [logs, setLogs] = useState(['Sistema iniciado. Esperando conexión...']);
  const [alerts, setAlerts] = useState([]);
  const [ultimaActualizacion, setUltimaActualizacion] = useState('--');

  useEffect(() => {
    let updateInterval;
    if (connected) {
      updateInterval = setInterval(obtenerDatos, intervaloActualizacion);
      obtenerDatos();
    }
    return () => clearInterval(updateInterval);
  }, [connected, intervaloActualizacion, espIP, espPort]);

  const showTab = (tabName) => {
    setActiveTab(tabName);
  };

  const conectarESP = () => {
    if (!espIP) {
      mostrarAlerta('Por favor, ingresa la IP del ESP8266', 'error');
      return;
    }
    localStorage.setItem('esp-ip', espIP);
    localStorage.setItem('esp-port', espPort);
    setConnected(true);
    agregarLog(`Intentando conectar a ${espIP}:${espPort}`);
    mostrarAlerta('Intentando conectar con ESP8266...', 'warning');
  };

  const desconectarESP = () => {
    setConnected(false);
    agregarLog('Desconectado manualmente');
    mostrarAlerta('Desconectado del ESP8266', 'error');
  };

  const obtenerDatos = async () => {
    try {
      const response = await fetch(`http://${espIP}:${espPort}/api/datos`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const newDatos = await response.json();
      setDatos(newDatos);
      if (!connected) {
        setConnected(true);
        agregarLog(`✅ Conectado exitosamente a ${espIP}:${espPort}`);
        mostrarAlerta('Conectado exitosamente', 'success');
      }
      setUltimaActualizacion(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error:', error);
      if (connected) {
        setConnected(false);
        agregarLog(`❌ Error de conexión: ${error.message}`);
        mostrarAlerta('Error de conexión', 'error');
      }
    }
  };

  const controlarBomba = async (encender) => {
    try {
      const response = await fetch(`http://${espIP}:${espPort}/api/bomba`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: encender }),
      });
      if (!response.ok) throw new Error('Error HTTP');
      agregarLog(encender ? 'Bomba ENCENDIDA' : 'Bomba APAGADA');
      mostrarAlerta(`Bomba ${encender ? 'encendida' : 'apagada'}`, encender ? 'success' : 'error');
      obtenerDatos();
    } catch (err) {
      agregarLog('❌ Error al controlar bomba: ' + err.message);
      mostrarAlerta('Error al enviar comando', 'error');
    }
  };

  const cambiarModo = async () => {
    const modo = document.getElementById('modo-automatico').value === 'true';
    try {
      const response = await fetch(`http://${espIP}:${espPort}/api/modo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ automatico: modo }),
      });
      if (!response.ok) throw new Error('Error HTTP');
      agregarLog(`Modo automático ${modo ? 'ACTIVADO' : 'DESACTIVADO'}`);
      mostrarAlerta(`Modo automático ${modo ? 'activado' : 'desactivado'}`, 'warning');
      obtenerDatos();
    } catch (err) {
      agregarLog('❌ Error al cambiar modo: ' + err.message);
      mostrarAlerta('Error al cambiar modo', 'error');
    }
  };

  const actualizarUmbral = async () => {
    const umbral = parseInt(document.getElementById('umbral-humedad').value);
    try {
      const response = await fetch(`http://${espIP}:${espPort}/api/umbral`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ humedadMinima: umbral }),
      });
      if (!response.ok) throw new Error('Error HTTP');
      agregarLog(`Umbral de humedad actualizado a ${umbral}%`);
      mostrarAlerta(`Umbral actualizado a ${umbral}%`, 'success');
      obtenerDatos();
    } catch (err) {
      agregarLog('❌ Error al actualizar umbral: ' + err.message);
      mostrarAlerta('Error al actualizar umbral', 'error');
    }
  };

  const actualizarIntervalo = () => {
    const valor = parseInt(document.getElementById('intervalo-actualizacion').value) * 1000;
    if (valor >= 1000) {
      setIntervaloActualizacion(valor);
      agregarLog(`Intervalo de actualización cambiado a ${valor / 1000} s`);
      mostrarAlerta(`Intervalo: ${valor / 1000} segundos`, 'success');
    } else {
      mostrarAlerta('Intervalo inválido', 'error');
    }
  };

  const limpiarHistorial = () => {
    localStorage.clear();
    agregarLog('Historial de configuración limpiado');
    mostrarAlerta('Historial limpiado', 'warning');
  };

  const exportarDatos = () => {
    const exportData = {
      temperatura: datos.temperatura?.toFixed(1) + '°C' || '--',
      humedadAmbiental: datos.humedadAmbiental?.toFixed(1) + '%' || '--',
      humedadSuelo: datos.humedad + '%' || '--',
      umbral: datos.humedadMinima + '%' || '--',
      ultimoRiego: datos.ultimoRiego + ' s' || '--',
      timestamp: datos.timestamp || '--',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos_riego.json';
    a.click();
    URL.revokeObjectURL(url);
    agregarLog('Datos exportados');
    mostrarAlerta('Datos exportados en JSON', 'success');
  };

  const limpiarLogs = () => {
    setLogs([]);
    agregarLog('Logs limpiados');
  };

  const agregarLog = (msg) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const mostrarAlerta = (mensaje, tipo) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 4000);
  };

  const getTempPorcentaje = () => {
    if (datos.temperatura === undefined || isNaN(datos.temperatura)) return 0;
    return Math.min(100, Math.max(0, (datos.temperatura / 50) * 100));
  };

  const getSueloColor = () => {
    if (datos.humedad < 30) return '#e74c3c';
    if (datos.humedad < 60) return '#f39c12';
    return '#2ecc71';
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Sistema de Riego Inteligente</h1>
        <p>Monitoreo completo en tiempo real</p>
        <div className={`connection-badge ${connected ? 'connected' : 'disconnected'}`} id="connectionBadge">
          {connected ? 'Conectado' : 'Desconectado'}
        </div>
      </div>

      <div className="nav-tabs">
        <button className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => showTab('dashboard')}>
          Dashboard
        </button>
        <button className={`tab ${activeTab === 'control' ? 'active' : ''}`} onClick={() => showTab('control')}>
          Control
        </button>
        <button className={`tab ${activeTab === 'config' ? 'active' : ''}`} onClick={() => showTab('config')}>
          Configuración
        </button>
        <button className={`tab ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => showTab('logs')}>
          Logs
        </button>
      </div>

      <div className="content">
        {activeTab === 'dashboard' && (
          <div id="dashboard" className="tab-content active">
            <div className="control-section">
              <h3>Conexión ESP8266</h3>
              <div className="control-grid">
                <div className="control-group">
                  <div className="form-group">
                    <label className="form-label">IP del ESP8266:</label>
                    <input
                      type="text"
                      className="form-input"
                      id="esp-ip"
                      placeholder="192.168.1.100"
                      value={espIP}
                      onChange={(e) => setEspIP(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Puerto:</label>
                    <input
                      type="text"
                      className="form-input"
                      id="esp-port"
                      placeholder="80"
                      value={espPort}
                      onChange={(e) => setEspPort(e.target.value)}
                    />
                  </div>
                  <button className="btn success" onClick={conectarESP}>
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
                <div className="metric-value" id="temperatura-valor">
                  {datos.temperatura !== undefined && !isNaN(datos.temperatura)
                    ? datos.temperatura.toFixed(1) + '°C'
                    : '--'}
                </div>
                <div className="metric-unit">Grados Celsius</div>
                <div className="metric-bar">
                  <div
                    className="metric-bar-fill"
                    id="temperatura-bar"
                    style={{ background: '#e67e22', width: `${getTempPorcentaje()}%` }}
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
                <div className="metric-value" id="humedad-ambiental-valor">
                  {datos.humedadAmbiental !== undefined && !isNaN(datos.humedadAmbiental)
                    ? datos.humedadAmbiental.toFixed(1) + '%'
                    : '--'}
                </div>
                <div className="metric-unit">Porcentaje (%)</div>
                <div className="metric-bar">
                  <div
                    className="metric-bar-fill"
                    id="humedad-ambiental-bar"
                    style={{ background: '#3498db', width: `${datos.humedadAmbiental || 0}%` }}
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
                <div className="metric-value" id="humedad-suelo-valor">
                  {datos.humedad !== undefined ? datos.humedad + '%' : '--'}
                </div>
                <div className="metric-unit">Porcentaje (%)</div>
                <div className="metric-bar">
                  <div
                    className="metric-bar-fill"
                    id="humedad-suelo-bar"
                    style={{ background: getSueloColor(), width: `${datos.humedad || 0}%` }}
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
                <div id="bomba-status">
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
                <div id="modo-status">
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
                <div id="sistema-status">
                  <div className={`status-indicator ${connected ? 'status-on' : 'status-off'}`}>
                    <div className="status-dot"></div>
                    {connected ? 'CONECTADO' : 'DESCONECTADO'}
                  </div>
                </div>
                <div className="metric-unit" id="ultima-actualizacion">
                  Última actualización: {ultimaActualizacion}
                </div>
              </div>
            </div>

            <div className="control-section">
              <h3>Información Detallada</h3>
              <div className="system-info">
                <div className="info-item">
                  <span className="info-label">Umbral de Humedad:</span>
                  <span className="info-value" id="info-umbral">
                    {(datos.humedadMinima || '--') + ' %'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Estado de Espera:</span>
                  <span className="info-value" id="info-espera">
                    {datos.enEspera ? 'SÍ' : 'NO'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tiempo Restante:</span>
                  <span className="info-value" id="info-tiempo-restante">
                    {(datos.tiempoEsperaRestante || 0) + ' s'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Último Riego:</span>
                  <span className="info-value" id="info-ultimo-riego">
                    {(datos.ultimoRiego || '--') + ' s'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">IP del ESP8266:</span>
                  <span className="info-value" id="info-ip">
                    {espIP}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Timestamp:</span>
                  <span className="info-value" id="info-timestamp">
                    {datos.timestamp || '--'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'control' && (
          <div id="control" className="tab-content">
            <h2>Panel de Control</h2>
            <div className="control-section">
              <div className="control-grid">
                <div className="control-group">
                  <div className="control-title">
                    <span>⚡</span>
                    Control Manual de Bomba
                  </div>
                  <button className="btn success" onClick={() => controlarBomba(true)}>
                    <span>🟢</span> Encender Bomba
                  </button>
                  <button className="btn danger" onClick={() => controlarBomba(false)}>
                    <span>🔴</span> Apagar Bomba
                  </button>
                </div>

                <div className="control-group">
                  <div className="control-title">
                    <span>🤖</span>
                    Modo de Operación
                  </div>
                  <div className="form-group">
                    <label className="form-label">Modo Automático:</label>
                    <select className="form-input" id="modo-automatico">
                      <option value="true">Activado</option>
                      <option value="false">Desactivado</option>
                    </select>
                  </div>
                  <button className="btn" onClick={cambiarModo}>
                    <span>🔄</span> Cambiar Modo
                  </button>
                </div>

                <div className="control-group">
                  <div className="control-title">
                    <span>⚙️</span>
                    Configuración de Riego
                  </div>
                  <div className="form-group">
                    <label className="form-label">Humedad Mínima (%):</label>
                    <input type="number" className="form-input" id="umbral-humedad" min="0" max="100" defaultValue="40" />
                  </div>
                  <button className="btn warning" onClick={actualizarUmbral}>
                    <span>💾</span> Guardar Umbral
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
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
        )}

        {activeTab === 'logs' && (
          <div id="logs" className="tab-content">
            <h2>Registro de Actividades</h2>
            <div className="control-section">
              <h3>Log en Tiempo Real</h3>
              <div className="log-container" id="log-container">
                {logs.map((log, index) => (
                  <div key={index} className="log-entry">
                    {log}
                  </div>
                ))}
              </div>
              <button className="btn" onClick={limpiarLogs} style={{ marginTop: '15px' }}>
                <span>🗑️</span> Limpiar Logs
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="alerts-container" id="alerts-container">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert ${alert.tipo}`}>
            {alert.mensaje}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
