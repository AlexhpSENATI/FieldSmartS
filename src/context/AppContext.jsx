// AppContext.jsx (updated to import from firebase.js)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { db } from '../firebase'; // Import db from firebase.js

const sensoresRef = ref(db, "sensores");
const configRef = ref(db, "config");

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentConfig, setCurrentConfig] = useState({});
  const [espIPConectado, setEspIPConectado] = useState("");
  const [conectado, setConectado] = useState(false);
  const [temp, setTemp] = useState("--");
  const [humAmb, setHumAmb] = useState("--");
  const [humSuelo, setHumSuelo] = useState("--");
  const [bomba, setBomba] = useState("--");
  const [infoUmbralMin, setInfoUmbralMin] = useState("--");
  const [infoIP, setInfoIP] = useState("--");
  const [infoTiempoUso, setInfoTiempoUso] = useState("--");
  const [infoUltimoRiego, setInfoUltimoRiego] = useState("--");
  const [infoEnEspera, setInfoEnEspera] = useState("--");
  const [infoTiempoEspera, setInfoTiempoEspera] = useState("--");
  const [infoSistema, setInfoSistema] = useState("Inactivo ❌");
  const [infoModo, setInfoModo] = useState("--");

  const actualizarEstadoEspera = (data) => {
    const enEsperaEstado = data.enEspera ? true : false;
    setInfoEnEspera(enEsperaEstado ? "Sí" : "No");

    setInfoTiempoEspera(
      (enEsperaEstado && data.tiempoRestanteEspera !== undefined) ?
        data.tiempoRestanteEspera + " s" :
        (currentConfig.tiempoEspera || "--") + " s"
    );
  };

  // 🔹 Escuchar configuración en Firebase
  useEffect(() => {
    const unsubscribeConfig = onValue(configRef, (snapshot) => {
      const cfg = snapshot.val();
      if (cfg) {
        setCurrentConfig(cfg);
        setInfoModo(cfg.modoAutomatico ? "Automático 🤖" : "Manual ✋");
      }
    });
    return () => unsubscribeConfig();
  }, []);

  // 🔹 Escuchar sensores cuando hay IP conectada
  useEffect(() => {
    if (!espIPConectado) {
      // Reset states when disconnected
      setTemp("--");
      setHumAmb("--");
      setHumSuelo("--");
      setBomba("--");
      setInfoUmbralMin("--");
      setInfoIP("--");
      setInfoTiempoUso("--");
      setInfoUltimoRiego("--");
      setInfoEnEspera("--");
      setInfoTiempoEspera("--");
      setInfoSistema("Inactivo ❌");
      setConectado(false);
      return;
    }

    setConectado(true);
    setInfoSistema("Activo ✅"); // Set active on connect, update if no data?

    const unsubscribeSensores = onValue(sensoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.ip === espIPConectado) {
        setTemp(data.temperatura + " °C");
        setHumAmb(data.humedadAmbiental + " %");
        setHumSuelo(data.humedadSuelo + " %");
        setBomba(data.bomba ? "💧 ENCENDIDA" : "💤 APAGADA");

        setInfoUmbralMin(currentConfig.umbralMin || "--");
        setInfoIP(data.ip || "--");
        setInfoTiempoUso(data.tiempoUso || "--");
        setInfoUltimoRiego(data.ultimoRiego ? new Date(data.ultimoRiego).toLocaleTimeString() : "--");

        actualizarEstadoEspera(data);
        setInfoSistema("Activo ✅");
      } else {
        // If no matching data, perhaps keep Activo or set warning, but for now, keep as is
        // To match original, only set Activo if match
        setInfoSistema("Activo ✅"); // Or check if snapshot exists but no match
      }
    });

    return () => {
      unsubscribeSensores();
      // Reset on unmount or ip change
      setTemp("--");
      setHumAmb("--");
      setHumSuelo("--");
      setBomba("--");
      setInfoUmbralMin("--");
      setInfoIP("--");
      setInfoTiempoUso("--");
      setInfoUltimoRiego("--");
      setInfoEnEspera("--");
      setInfoTiempoEspera("--");
    };
  }, [espIPConectado, currentConfig]); // Depend on espIPConectado and currentConfig for umbralMin

  // 🔹 Conectar ESP
  const conectarESP = (ip) => {
    if (!ip.trim()) {
      alert("Por favor ingresa la IP del ESP.");
      return;
    }
    setEspIPConectado(ip.trim());
    alert("Conectado al ESP con IP: " + ip.trim());
  };

  // 🔹 Desconectar ESP
  const desconectarESP = () => {
    setEspIPConectado("");
    alert("ESP Desconectado");
  };

  // 🔹 Guardar configuración
  const guardarConfig = (umbralMin, umbralMax, tiempoRiego, tiempoEspera) => {
    update(configRef, {
      umbralMin: parseInt(umbralMin),
      umbralMax: parseInt(umbralMax),
      tiempoRiego: parseInt(tiempoRiego),
      tiempoEspera: parseInt(tiempoEspera),
    });
  };

  // 🔹 Cambiar modo desde select
  const cambiarModo = (valor) => {
    const nuevoEstado = valor === "true";

    update(configRef, {
      modoAutomatico: nuevoEstado
    });

    alert("Modo cambiado a: " + (nuevoEstado ? "✅ Automático 🤖" : "❌ Manual ✋"));
  };

  // 🔹 Control manual bomba
  const controlBomba = (estado) => {
    update(configRef, {
      bombaManual: estado,
      modoAutomatico: false
    });
  };

  const value = {
    // States
    currentConfig,
    espIPConectado,
    conectado,
    temp,
    humAmb,
    humSuelo,
    bomba,
    infoUmbralMin,
    infoIP,
    infoTiempoUso,
    infoUltimoRiego,
    infoEnEspera,
    infoTiempoEspera,
    infoSistema,
    infoModo,
    // Functions
    conectarESP,
    desconectarESP,
    guardarConfig,
    cambiarModo,
    controlBomba,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};