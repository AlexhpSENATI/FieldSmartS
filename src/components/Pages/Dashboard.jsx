// Dashboard.jsx (updated to sync input with context)
import React, { useState, useEffect } from 'react';
import { useAppContext } from './../../context/AppContext';

const Dashboard = () => {
  const [inputIP, setInputIP] = useState('');
  const {
    temp,
    humAmb,
    humSuelo,
    bomba,
    infoSistema,
    infoModo,
    infoUmbralMin,
    infoEnEspera,
    infoTiempoEspera,
    infoUltimoRiego,
    infoIP,
    infoTiempoUso,
    espIPConectado,
    conectarESP,
    desconectarESP,
  } = useAppContext();

  // Sync input with connected IP on mount or change
  useEffect(() => {
    setInputIP(espIPConectado);
  }, [espIPConectado]);

  const handleConectar = () => {
    if (!inputIP.trim()) {
      alert("Por favor ingresa la IP del ESP.");
      return;
    }
    conectarESP(inputIP.trim());
  };

  const handleDesconectar = () => {
    desconectarESP();
  };

  return (
    <div>
      <h1>🌱 Panel de Riego Automático</h1>

      <h2>🌐 Conectar ESP</h2>
      <input
        type="text"
        value={inputIP}
        onChange={(e) => setInputIP(e.target.value)}
        placeholder="Ingresa IP del ESP"
      />
      <button onClick={handleConectar}>Conectar</button>
      <button onClick={handleDesconectar}>Desconectar</button>

      <h2>📊 Sensores</h2>
      <p>🌡️ Temperatura: <span id="temp">{temp}</span></p>
      <p>💧 Humedad Ambiental: <span id="humAmb">{humAmb}</span></p>
      <p>🌱 Humedad Suelo: <span id="humSuelo">{humSuelo}</span></p>
      <p>🚰 Estado Bomba: <span id="bomba">{bomba}</span></p>

      <h2>ℹ️ Información Adicional</h2>
      <p>⚡ Estado del Sistema: <span id="infoSistema">{infoSistema}</span></p>
      <p>🔀 Modo de Operación: <span id="infoModo" style={{ color: infoModo.includes('Automático') ? 'green' : 'red' }}>{infoModo}</span></p>
      <p>📉 Umbral Min Actual: <span id="infoUmbralMin">{infoUmbralMin}</span>%</p>
      <p>⏱️ Estado de Espera: <span id="infoEnEspera">{infoEnEspera}</span></p>
      <p>⏳ Tiempo de Espera Configurado: <span id="infoTiempoEspera">{infoTiempoEspera}</span></p>
      <p>💦 Último Riego: <span id="infoUltimoRiego">{infoUltimoRiego}</span></p>
      <p>🌐 IP ESP8266: <span id="infoIP">{infoIP}</span></p>
      <p>🕒 Tiempo de Uso: <span id="infoTiempoUso">{infoTiempoUso}</span> s</p>
    </div>
  );
};

export default Dashboard;