import React, { useState, useEffect } from "react";
import "./App.css"; // puedes mover estilos aquí o en otro CSS separado

export default function SistemaRiego() {
  const [espIP, setEspIP] = useState(localStorage.getItem("esp-ip") || "192.168.1.100");
  const [espPort, setEspPort] = useState(localStorage.getItem("esp-port") || "80");
  const [connected, setConnected] = useState(false);
  const [intervaloActualizacion] = useState(2000);
  const [updateInterval, setUpdateInterval] = useState(null);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [logs, setLogs] = useState(["Sistema iniciado. Esperando conexión..."]);
  const [alerts, setAlerts] = useState([]);

  const [datos, setDatos] = useState({
    temperatura: null,
    humedadAmbiental: null,
    humedad: null,
    bomba: false,
    automatico: false,
    humedadMinima: 30,
    enEspera: false,
    tiempoEsperaRestante: 0,
    ultimoRiego: null,
    timestamp: null,
  });

  useEffect(() => {
    agregarLog("Sistema iniciado");
  }, []);

  const agregarLog = (msg) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const mostrarAlerta = (mensaje, tipo) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 4000);
  };

  const conectarESP = () => {
    if (!espIP) {
      mostrarAlerta("Por favor, ingresa la IP del ESP8266", "error");
      return;
    }
    localStorage.setItem("esp-ip", espIP);
    localStorage.setItem("esp-port", espPort);

    if (updateInterval) clearInterval(updateInterval);

    const interval = setInterval(obtenerDatos, intervaloActualizacion);
    setUpdateInterval(interval);
    obtenerDatos();

    agregarLog(`Intentando conectar a ${espIP}:${espPort}`);
    mostrarAlerta("Intentando conectar con ESP8266...", "warning");
  };

  const desconectarESP = () => {
    if (updateInterval) clearInterval(updateInterval);
    setUpdateInterval(null);
    setConnected(false);
    agregarLog("Desconectado manualmente");
    mostrarAlerta("Desconectado del ESP8266", "error");
  };

  const obtenerDatos = async () => {
    try {
      const response = await fetch(`http://${espIP}:${espPort}/api/datos`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (!connected) {
        setConnected(true);
        agregarLog(`✅ Conectado exitosamente a ${espIP}:${espPort}`);
        mostrarAlerta("Conectado exitosamente", "success");
      }
      setDatos(data);
    } catch (error) {
      if (connected) {
        setConnected(false);
        agregarLog(`❌ Error de conexión: ${error.message}`);
        mostrarAlerta("Error de conexión", "error");
      }
    }
  };

  const controlarBomba = async (encender) => {
    try {
      const response = await fetch(`http://${espIP}:${espPort}/api/bomba`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: encender }),
      });
      if (!response.ok) throw new Error("Error HTTP");
      agregarLog(encender ? "Bomba ENCENDIDA" : "Bomba APAGADA");
      mostrarAlerta(`Bomba ${encender ? "encendida" : "apagada"}`, encender ? "success" : "error");
      obtenerDatos();
    } catch (err) {
      agregarLog("❌ Error al controlar bomba: " + err.message);
      mostrarAlerta("Error al enviar comando", "error");
    }
  };

  const cambiarModo = async () => {
    try {
      const response = await fetch(`http://${espIP}:${espPort}/api/modo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ automatico: datos.automatico }),
      });
      if (!response.ok) throw new Error("Error HTTP");
      agregarLog(`Modo automático ${datos.automatico ? "ACTIVADO" : "DESACTIVADO"}`);
      mostrarAlerta(`Modo automático ${datos.automatico ? "activado" : "desactivado"}`, "warning");
      obtenerDatos();
    } catch (err) {
      agregarLog("❌ Error al cambiar modo: " + err.message);
      mostrarAlerta("Error al cambiar modo", "error");
    }
  };

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <h1>Sistema de Riego Inteligente</h1>
        <p>Monitoreo completo en tiempo real</p>
        <div className={`connection-badge ${connected ? "connected" : "disconnected"}`}>
          {connected ? "Conectado" : "Desconectado"}
        </div>
      </div>

      {/* NAV */}
      <div className="nav-tabs">
        <button className={`tab ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button className={`tab ${activeTab === "control" ? "active" : ""}`} onClick={() => setActiveTab("control")}>Control</button>
        <button className={`tab ${activeTab === "config" ? "active" : ""}`} onClick={() => setActiveTab("config")}>Configuración</button>
        <button className={`tab ${activeTab === "logs" ? "active" : ""}`} onClick={() => setActiveTab("logs")}>Logs</button>
      </div>

      {/* CONTENT */}
      <div className="content">
        {activeTab === "dashboard" && (
          <div>
            <h2>📊 Dashboard</h2>
            <p><b>Temperatura:</b> {datos.temperatura ?? "--"} °C</p>
            <p><b>Humedad Ambiental:</b> {datos.humedadAmbiental ?? "--"} %</p>
            <p><b>Humedad Suelo:</b> {datos.humedad ?? "--"} %</p>
            <p><b>Bomba:</b> {datos.bomba ? "Encendida" : "Apagada"}</p>
            <p><b>Modo Automático:</b> {datos.automatico ? "Activo" : "Manual"}</p>
          </div>
        )}
        {activeTab === "control" && (
          <div>
            <h2>⚙️ Control</h2>
            <button onClick={() => controlarBomba(true)}>Encender Bomba</button>
            <button onClick={() => controlarBomba(false)}>Apagar Bomba</button>
            <br /><br />
            <label>
              <input
                type="checkbox"
                checked={datos.automatico}
                onChange={(e) => {
                  setDatos({ ...datos, automatico: e.target.checked });
                  cambiarModo();
                }}
              />
              Activar Modo Automático
            </label>
          </div>
        )}
        {activeTab === "config" && (
          <div>
            <h2>⚙️ Configuración</h2>
            <input value={espIP} onChange={(e) => setEspIP(e.target.value)} placeholder="IP del ESP8266" />
            <input value={espPort} onChange={(e) => setEspPort(e.target.value)} placeholder="Puerto" />
            <br />
            <button onClick={conectarESP}>Conectar</button>
            <button onClick={desconectarESP}>Desconectar</button>
          </div>
        )}
        {activeTab === "logs" && (
          <div className="log-container">
            {logs.map((l, i) => (
              <div key={i} className="log-entry">{l}</div>
            ))}
          </div>
        )}
      </div>

      {/* ALERTS */}
      <div className="alerts-container">
        {alerts.map((a) => (
          <div key={a.id} className={`alert ${a.tipo}`}>{a.mensaje}</div>
        ))}
      </div>
    </div>
  );
}
