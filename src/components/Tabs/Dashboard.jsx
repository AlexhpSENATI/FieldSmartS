import React, { useState, useEffect, useRef } from "react";

export default function SistemaRiego() {
  const [espIP, setEspIP] = useState(localStorage.getItem("esp-ip") || "192.168.1.100");
  const [espPort, setEspPort] = useState(localStorage.getItem("esp-port") || "80");
  const [connected, setConnected] = useState(false);
  const [intervaloActualizacion, setIntervaloActualizacion] = useState(2000);

  const [temperatura, setTemperatura] = useState(null);
  const [humedadAmbiental, setHumedadAmbiental] = useState(null);
  const [humedad, setHumedad] = useState(null);
  const [bomba, setBomba] = useState(false);
  const [automatico, setAutomatico] = useState(false);
  const [humedadMinima, setHumedadMinima] = useState(null);
  const [enEspera, setEnEspera] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [ultimoRiego, setUltimoRiego] = useState("--");
  const [timestamp, setTimestamp] = useState("--");

  const [logs, setLogs] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const updateInterval = useRef(null);

  // Función para agregar logs
  const agregarLog = (msg) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Función para mostrar alertas
  const mostrarAlerta = (mensaje, tipo) => {
    const id = Date.now();
    setAlertas((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setAlertas((prev) => prev.filter((a) => a.id !== id));
    }, 4000);
  };

  // Conectar con ESP
  const conectarESP = () => {
    if (!espIP) {
      mostrarAlerta("Por favor, ingresa la IP del ESP8266", "error");
      return;
    }
    localStorage.setItem("esp-ip", espIP);
    localStorage.setItem("esp-port", espPort);

    if (updateInterval.current) clearInterval(updateInterval.current);
    updateInterval.current = setInterval(obtenerDatos, intervaloActualizacion);

    obtenerDatos();
    agregarLog(`Intentando conectar a ${espIP}:${espPort}`);
    mostrarAlerta("Intentando conectar con ESP8266...", "warning");
  };

  const desconectarESP = () => {
    if (updateInterval.current) {
      clearInterval(updateInterval.current);
      updateInterval.current = null;
    }
    setConnected(false);
    agregarLog("Desconectado manualmente");
    mostrarAlerta("Desconectado del ESP8266", "error");
  };

  // Obtener datos
  const obtenerDatos = async () => {
    try {
      const response = await fetch(`http://${espIP}:${espPort}/api/datos`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const datos = await response.json();

      if (!connected) {
        setConnected(true);
        agregarLog(`✅ Conectado a ${espIP}:${espPort}`);
        mostrarAlerta("Conectado exitosamente", "success");
      }

      // Actualizar estados
      setTemperatura(datos.temperatura);
      setHumedadAmbiental(datos.humedadAmbiental);
      setHumedad(datos.humedad);
      setBomba(datos.bomba);
      setAutomatico(datos.automatico);
      setHumedadMinima(datos.humedadMinima);
      setEnEspera(datos.enEspera);
      setTiempoRestante(datos.tiempoEsperaRestante);
      setUltimoRiego(datos.ultimoRiego);
      setTimestamp(datos.timestamp);
    } catch (error) {
      console.error("Error:", error);
      if (connected) {
        setConnected(false);
        agregarLog(`❌ Error de conexión: ${error.message}`);
        mostrarAlerta("Error de conexión", "error");
      }
    }
  };

  // Controlar bomba
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

  // Cambiar modo
  const cambiarModo = async (modo) => {
    try {
      const response = await fetch(`http://${espIP}:${espPort}/api/modo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ automatico: modo }),
      });
      if (!response.ok) throw new Error("Error HTTP");
      agregarLog(`Modo automático ${modo ? "ACTIVADO" : "DESACTIVADO"}`);
      mostrarAlerta(`Modo automático ${modo ? "activado" : "desactivado"}`, "warning");
      obtenerDatos();
    } catch (err) {
      agregarLog("❌ Error al cambiar modo: " + err.message);
      mostrarAlerta("Error al cambiar modo", "error");
    }
  };

  // Actualizar umbral
  const actualizarUmbral = async (umbral) => {
    try {
      const response = await fetch(`http://${espIP}:${espPort}/api/umbral`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ humedadMinima: umbral }),
      });
      if (!response.ok) throw new Error("Error HTTP");
      agregarLog(`Umbral actualizado a ${umbral}%`);
      mostrarAlerta(`Umbral actualizado a ${umbral}%`, "success");
      obtenerDatos();
    } catch (err) {
      agregarLog("❌ Error al actualizar umbral: " + err.message);
      mostrarAlerta("Error al actualizar umbral", "error");
    }
  };

  // Limpiar logs
  const limpiarLogs = () => setLogs([]);

  // Render UI
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Sistema de Riego Inteligente</h1>

      {/* Configuración de conexión */}
      <div className="flex gap-2">
        <input value={espIP} onChange={(e) => setEspIP(e.target.value)} placeholder="IP ESP8266" className="border p-2 rounded" />
        <input value={espPort} onChange={(e) => setEspPort(e.target.value)} placeholder="Puerto" className="border p-2 rounded w-20" />
        <button onClick={conectarESP} className="bg-green-600 text-white px-4 py-2 rounded">Conectar</button>
        <button onClick={desconectarESP} className="bg-red-600 text-white px-4 py-2 rounded">Desconectar</button>
      </div>

      {/* Estado conexión */}
      <div>
        Estado:{" "}
        <span className={`px-2 py-1 rounded ${connected ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
          {connected ? "Conectado" : "Desconectado"}
        </span>
      </div>

      {/* Sensores */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 border rounded">🌡️ Temperatura: {temperatura ?? "--"} °C</div>
        <div className="p-3 border rounded">💧 Humedad Ambiental: {humedadAmbiental ?? "--"} %</div>
        <div className="p-3 border rounded">🌱 Humedad Suelo: {humedad ?? "--"} %</div>
      </div>

      {/* Estado bomba */}
      <div className="p-3 border rounded">
        🚰 Bomba:{" "}
        <span className={bomba ? "text-green-600" : "text-red-600"}>{bomba ? "Encendida" : "Apagada"}</span>
        <div className="mt-2 space-x-2">
          <button onClick={() => controlarBomba(true)} className="bg-blue-600 text-white px-2 py-1 rounded">Encender</button>
          <button onClick={() => controlarBomba(false)} className="bg-gray-600 text-white px-2 py-1 rounded">Apagar</button>
        </div>
      </div>

      {/* Modo automático */}
      <div className="p-3 border rounded">
        ⚙️ Modo Automático:{" "}
        <span className={automatico ? "text-green-600" : "text-red-600"}>{automatico ? "Activado" : "Desactivado"}</span>
        <div className="mt-2 space-x-2">
          <button onClick={() => cambiarModo(true)} className="bg-green-600 text-white px-2 py-1 rounded">Activar</button>
          <button onClick={() => cambiarModo(false)} className="bg-red-600 text-white px-2 py-1 rounded">Desactivar</button>
        </div>
      </div>

      {/* Logs */}
      <div className="p-3 border rounded">
        <div className="flex justify-between">
          <h2 className="font-bold">Logs</h2>
          <button onClick={limpiarLogs} className="text-sm text-gray-600">Limpiar</button>
        </div>
        <div className="h-40 overflow-y-auto mt-2 text-sm bg-gray-50 p-2 rounded">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>

      {/* Alertas */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {alertas.map((a) => (
          <div key={a.id} className={`p-2 rounded shadow ${a.tipo === "success" ? "bg-green-500" : a.tipo === "error" ? "bg-red-500" : "bg-yellow-500"} text-white`}>
            {a.mensaje}
          </div>
        ))}
      </div>
    </div>
  );
}
