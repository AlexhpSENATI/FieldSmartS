// Dashboard.jsx - Versión Multicolor con Iconos Bootstrap
import React, { useState, useEffect } from 'react';
import { useAppContext } from './../../context/AppContext';
import '../../styles/Dashboard.css';

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

  //==========================SINCRONIZAR INPUT CON ESTADO DEL IP==========================
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

  //==========================FUNCIONES PARA TEMPERATURA PARA COLOR==========================
  const getTempColor = (temp) => {
    if (temp < 15) return '#3498db'; // Azul para frío
    if (temp >= 15 && temp <= 30) return '#2ecc71'; // Verde para normal
    return '#e74c3c'; // Rojo para caliente
  };

  //==========================FUNCIONES PARA HUMEDAD AMBIENTAL PARA COLOR==========================
  const getHumAmbColor = (hum) => {
    if (hum < 30) return '#e67e22'; // Naranja para seco
    if (hum >= 30 && hum <= 70) return '#2ecc71'; // Verde para normal
    return '#3498db'; // Azul para húmedo
  };

  //==========================FUNCIONES PARA HUMEDAD SUELO PARA COLOR==========================
  const getHumSueloColor = (hum) => {
    if (hum < infoUmbralMin) return '#e74c3c'; // Rojo para seco (necesita riego)
    if (hum >= infoUmbralMin && hum <= infoUmbralMin + 10) return '#f39c12'; // Amarillo para aceptable
    return '#2ecc71'; // Verde para óptimo
  };

  return (
    <div className="dashboard-container">
      <div className='dashboard-title'>
        <h1>Informacion General </h1>
      </div>

      <br />
    

      <section className="dashboard-connection">
        <h2>Conexión del Dispositivo</h2>
        <div className="connection-controls">
          <input
            type="text"
            value={inputIP}
            onChange={(e) => setInputIP(e.target.value)}
            placeholder="Ingresa la dirección IP del ESP"
            className="connection-input"
          />
          <button
            onClick={handleConectar}
            className="btn btn-connect"
          >
            <i className="bi bi-plug"></i> Conectar
          </button>
          <button
            onClick={handleDesconectar}
            className="btn btn-disconnect"
          >
            <i className="bi bi-plug-fill"></i> Desconectar
          </button>
        </div>
        <div className="connection-status">
          <span className={`status-indicator ${espIPConectado ? 'connected' : 'disconnected'}`}></span>
          {espIPConectado ? `Conectado a: ${espIPConectado}` : 'Desconectado'}
        </div>
      </section>

      <section className="dashboard-sensors">
        <div className="sensor-title">
          <i className="bi bi-activity"></i>
          <h2>Datos de Sensores</h2>
        </div>

        <div className="sensors-grid">
          {/*=============================TARJETA DE ESTADO DE TEMPERATURA============================*/}
          <div className="sensor-card temp-card">
            <div className="sensor-icon">
              <i className="bi bi-thermometer-high" style={{ fontSize: '2.5rem', color: getTempColor(temp) }}></i>
            </div>
            <div className="sensor-info">
              <h3>Temperatura</h3>
              <p className="sensor-value" style={{ color: getTempColor(temp) }}>
                {temp}°C
              </p>
            </div>
          </div>

          {/*=============================TARJETA DE ESTADO DE HUMEDAD AMBIENTAL============================*/}
          <div className="sensor-card hum-amb-card">
            <div className="sensor-icon">
              <i className="bi bi-droplet" style={{ fontSize: '2.5rem', color: getHumAmbColor(humAmb) }}></i>
            </div>
            <div className="sensor-info">
              <h3>Humedad Ambiental</h3>
              <p className="sensor-value" style={{ color: getHumAmbColor(humAmb) }}>
                {humAmb}%
              </p>
            </div>
          </div>

          {/*=============================TARJETA DE ESTADO DE HUMEDAD DE SUELO============================*/}
          <div className="sensor-card hum-suelo-card">
            <div className="sensor-icon">
              <i className="bi bi-moisture" style={{ fontSize: '2.5rem', color: getHumSueloColor(humSuelo) }}></i>
            </div>
            <div className="sensor-info">
              <h3>Humedad del Suelo</h3>
              <p className="sensor-value" style={{ color: getHumSueloColor(humSuelo) }}>
                {humSuelo}%
              </p>
              <p className="sensor-threshold">Umbral: {infoUmbralMin}%</p>
            </div>
          </div>

          {/*=============================TARJETA DE ESTADO DE LA BOMBA============================*/}
          <div className="sensor-card pump-card">
            <div className="sensor-icon">
              <i className={`bi ${bomba === 'Encendida' ? 'bi-play-circle-fill' : 'bi-lightning-charge-fill'}`}
                style={{ fontSize: '2.5rem', color: bomba === 'Encendida' ? '#3498db' : '#9b59b6' }}></i>
            </div>
            <div className="sensor-info">
              <h3>Estado de la Bomba</h3>
              <p className="sensor-value">
                <span className={`status ${bomba === 'Encendida' ? 'active' : 'inactive'}`}>
                  {bomba}
                </span>
              </p>
            </div>
          </div>

          {/*=============================TARJETA DE ESTADO DEL SISTEMA============================*/}
          <div className="sensor-card system-card">
            <div className="sensor-icon">
              <i
                className={`bi ${infoSistema === "Activado" ? "bi-lock-fill" : "bi-unlock-fill"}`}
                style={{
                  fontSize: "2.5rem",
                  color: infoSistema === "Activado" ? "#2ecc71" : "#2ecc71",
                }}
              ></i>
            </div>
            <div className="sensor-info">
              <h3>Estado del Sistema</h3>
              <p
                className="sensor-value"
                style={{ color: infoSistema === "Activado" ? "#2ecc71" : "#e74c3c" }}
              >
                {infoSistema}
              </p>
            </div>
          </div>

          {/* ==============================TARJETA DE MODO DE OPERACION============================ */}
          <div className="sensor-card mode-card">
            <div className="sensor-icon">
              <i className={`bi ${infoModo.includes('Automático') ? 'bi-robot' : 'bi-joystick'}`}
                style={{ fontSize: '2.5rem', color: infoModo.includes('Automático') ? '#f1c40f' : '#e67e22' }}></i>
            </div>
            <div className="sensor-info">
              <h3>Modo de Operación</h3>
              <p className="sensor-value" style={{ color: infoModo.includes('Automático') ? '#f1c40f' : '#e67e22' }}>
                {infoModo}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-additional">

        <div className="sensor-title">
          <i className="bi bi-info-circle"></i>
          <h2>Informacion Adicional</h2>
        </div>
        <div className="additional-grid">
          {/*=================TARJETA DE UMBRAL MINIMO================== */}
          <div className="info-card umbral-card">
            <div className="info-icon">
              <i className="bi bi-sliders" style={{ fontSize: '2.5rem', color: '#3498db' }}></i>
            </div>
            <h3>Umbral Mínimo Actual</h3>
            <p>{infoUmbralMin}%</p>
          </div>

          {/*=================TARJETA DE ESTADO DE ESPERA================== */}
          <div className="info-card espera-card">
            <div className="info-icon">
              <i className={`bi ${infoEnEspera === 'Sí' ? 'bi-hourglass-split' : 'bi-hourglass-top'}`}
                style={{ fontSize: '2.5rem', color: infoEnEspera === 'Sí' ? '#f39c12' : '#2ecc71' }}></i>
            </div>
            <h3>Estado de Espera</h3>
            <p>{infoEnEspera}</p>
          </div>

          {/*=================TARJETA DE TIEMPO DE ESPERA================== */}
          <div className="info-card tiempo-card">
            <div className="info-icon">
              <i className="bi bi-clock-history" style={{ fontSize: '2.5rem', color: '#f1c40f' }}></i>
            </div>
            <h3>Tiempo de Espera Configurado</h3>
            <p>{infoTiempoEspera}</p>
          </div>

          {/*=================TARJETA DE ULTIMO RIEGO================== */}
          <div className="info-card riego-card">
            <div className="info-icon">
              <i className="bi bi-droplet-half" style={{ fontSize: '2.5rem', color: '#00b4db' }}></i>
            </div>
            <h3>Último Riego</h3>
            <p>{infoUltimoRiego}</p>
          </div>

          {/*===================TARJETA DE IP=========================== */}
          <div className="info-card ip-card">
            <div className="info-icon">
              <i className="bi bi-wifi" style={{ fontSize: '2.5rem', color: '#1abc9c' }}></i>
            </div>
            <h3>IP ESP8266</h3>
            <p>{infoIP}</p>
          </div>

          {/*==================TARJETA DE TIEMPO DE USO=================   */}
          <div className="info-card uso-card">
            <div className="info-icon">
              <i className="bi bi-stopwatch" style={{ fontSize: '2.5rem', color: '#9b59b6' }}></i>
            </div>
            <h3>Tiempo de Uso</h3>
            <p>{infoTiempoUso} s</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;