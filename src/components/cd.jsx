import React, { useState, useEffect, useRef } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import "../../styles/Dashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

// Importa Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Configura tu Firebase (reemplaza con tus credenciales reales de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyAymFZm2CWSiGqXh9gI7t5pwj4C2Can-d8",
  authDomain: "bdsuelo.firebaseapp.com",
  databaseURL: "https://bdsuelo-default-rtdb.firebaseio.com",
  projectId: "bdsuelo",
  storageBucket: "bdsuelo.firebasestorage.app",
  messagingSenderId: "364633660427",
  appId: "1:364633660427:web:58c94d6400dd5e82997b0e",
  measurementId: "G-2JV33CWE83"
};
// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function MonitorSuelo() {
  const [esp32IP, setEsp32IP] = useState("192.168.1.100");
  const [isConnected, setIsConnected] = useState(false);
  const [conductivity, setConductivity] = useState("--");
  const [temperature, setTemperature] = useState("--");
  const [light, setLight] = useState("--");
  const [lightDesc, setLightDesc] = useState("Midiendo intensidad de luz en el entorno");
  const [statusMessage, setStatusMessage] = useState("🔄 Esperando conexión con ESP32...");
  const [statusClass, setStatusClass] = useState("status-bar status-connecting");
  const [lastUpdate, setLastUpdate] = useState("--");
  const refreshIconRef = useRef(null);
  const intervalRef = useRef(null);

  // 🔹 Datos de ejemplo para la gráfica
  const barData = [
    { name: "Conductividad", value: conductivity === "--" ? 0 : parseFloat(conductivity) },
    { name: "Temperatura", value: temperature === "--" ? 0 : parseFloat(temperature) },
    { name: "Luz", value: light === "--" ? 0 : parseFloat(light) }
  ];

  const updateStatusBar = (message, status) => {
    setStatusMessage(message);
    setStatusClass(`status-bar status-${status}`);
  };

  const saveToFirebase = async (data) => {
    try {
      await addDoc(collection(db, "sensorData"), {
        conductivity: data.conductivity,
        temperature: data.temperature,
        lightA0: data.lightA0,
        lightDO: data.lightDO,
        timestamp: serverTimestamp()
      });
      console.log("Datos guardados en Firebase exitosamente");
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      updateStatusBar("❌ Error al guardar datos en Firebase", "offline");
    }
  };

  const fetchSensorData = async () => {
    if (!esp32IP) {
      updateStatusBar("⚠️ Configura la IP del ESP32 primero", "offline");
      return;
    }
    if (refreshIconRef.current) refreshIconRef.current.classList.add("loading");
    try {
      const response = await fetch(`http://${esp32IP}/data`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setConductivity(data.conductivity.toFixed(1));
      setTemperature(data.temperature.toFixed(1));
      setLight(data.lightA0);
      setLightDesc(data.lightDO === 0 ? "💡 Mucha luz detectada" : "🌑 Poca luz / sombra detectada");
      updateStatusBar("✅ ESP32 conectado y funcionando correctamente", "online");
      setIsConnected(true);
      setLastUpdate(new Date().toLocaleString("es-ES"));

      // Guardar los datos en Firebase después de recibirlos
      await saveToFirebase(data);
    } catch (error) {
      console.error("Error al conectar con ESP32:", error);
      updateStatusBar("❌ Error de conexión - Verifica la IP y que el ESP32 esté encendido", "offline");
      setIsConnected(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } finally {
      if (refreshIconRef.current) refreshIconRef.current.classList.remove("loading");
    }
  };

  const connectToESP32 = () => {
    if (!esp32IP) {
      alert("Por favor ingresa la dirección IP del ESP32");
      return;
    }
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(esp32IP)) {
      alert("Por favor ingresa una dirección IP válida");
      return;
    }
    updateStatusBar("Conectando con ESP32...", "connecting");
    fetchSensorData().then(() => {
      if (isConnected) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(fetchSensorData, 3000);
      }
    });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="main-container">
      <div className="header">
        <h1>🌱 Monitor de Análisis de Suelo</h1>
        <p>Sistema ESP32 para monitoreo de conductividad, temperatura y luz ambiental</p>
      </div>

      <div className="connection-setup">
        <h3>⚙️ Configuración de Conexión</h3>
        <div className="ip-input-group">
          <input
            type="text"
            className="ip-input"
            value={esp32IP}
            onChange={(e) => setEsp32IP(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && connectToESP32()}
            placeholder="Dirección IP del ESP32 (ej: 192.168.1.100)"
          />
          <button className="connect-btn" onClick={connectToESP32}>Conectar</button>
        </div>
        <p><strong>Nota:</strong> Verifica la IP de tu ESP32 en el Monitor Serie de Arduino IDE</p>
      </div>

      <div id="statusBar" className={statusClass}>
        {statusMessage}
      </div>

      <div className="sensors-grid">
        <div className="sensor-card conductivity-card">
          <div className="sensor-icon">⚡</div>
          <div className="sensor-label">Conductividad Eléctrica</div>
          <div className="sensor-value">{conductivity}</div>
          <div className="sensor-unit">µS/cm</div>
          <div className="sensor-description">Indica la concentración de sales y nutrientes en el suelo</div>
        </div>

        <div className="sensor-card temperature-card">
          <div className="sensor-icon">🌡️</div>
          <div className="sensor-label">Temperatura del Suelo</div>
          <div className="sensor-value">{temperature}</div>
          <div className="sensor-unit">°C</div>
          <div className="sensor-description">Afecta la actividad microbiana y el crecimiento de raíces</div>
        </div>

        <div className="sensor-card light-card">
          <div className="sensor-icon">💡</div>
          <div className="sensor-label">Luz Ambiental</div>
          <div className="sensor-value">{light}</div>
          <div className="sensor-unit">Nivel (A0)</div>
          <div className="sensor-description">{lightDesc}</div>
        </div>
      </div>

      {/* 🔹 Gráfico de barras */}
      <div className="chart-container">
        <h3>📊 Comparación de Datos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4caf50" barSize={80} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="controls">
        <button className="refresh-btn" onClick={fetchSensorData}>
          <span ref={refreshIconRef}>🔄</span> Actualizar Datos
        </button>
        <div className="last-update">Última actualización: {lastUpdate}</div>
      </div>
    </div>
  );
}