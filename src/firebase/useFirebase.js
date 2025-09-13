// src/firebase/useFirebase.js
import { db } from "./firebaseConfig";
import { ref, onValue, update, off } from "firebase/database";

/*
  useFirebase.js centraliza las funciones que escriben/leen en la RTDB.
  Exporta:
    - conectarESP(espIP, setSensores, setConfig, setConectado)
    - desconectarESP(setSensores, setConectado)
    - guardarConfig(config)
    - cambiarModo(modoActual)
    - controlBomba(estado)
*/

let listeners = {
  sensoresUnsub: null,
  configUnsub: null,
  lastEspIP: null,
};

// Conectar al ESP y comenzar a escuchar sensores/config
export const conectarESP = (espIP, setSensores, setConfig, setConectado) => {
  if (!espIP || typeof espIP !== "string") {
    alert("Por favor ingresa la IP del ESP.");
    return;
  }

  // si ya estaba conectado a otra IP, desconectar primero
  if (listeners.sensoresUnsub) {
    try { listeners.sensoresUnsub(); } catch (e) {}
    listeners.sensoresUnsub = null;
  }

  // Escuchar nodo 'sensores'
  const sensoresRef = ref(db, "sensores");
  listeners.sensoresUnsub = onValue(sensoresRef, (snapshot) => {
    const data = snapshot.val();
    // Si en Firebase guardas un objeto por ESP (p.ej. sensores/esp1) ajusta la lógica.
    // Aquí asumimos que 'sensores' es un objeto plano con campos y opcionalmente ip.
    if (!data) {
      setSensores(null);
      setConectado(false);
      return;
    }

    // Si el registro incluye ip, usarlo para filtrar; si no, aceptar cualquier dato.
    if (data.ip) {
      if (data.ip === espIP) {
        setSensores(data);
        setConectado(true);
      } else {
        // no coincide IP: no mostramos
        // si prefieres mostrar igualmente, comenta este else.
        //setSensores(null);
        //setConectado(false);
      }
    } else {
      // Si no hay campo ip en la DB, asumimos que es el único ESP y mostramos
      setSensores(data);
      setConectado(true);
    }
  }, (err) => {
    console.error("Error onValue sensores:", err);
  });

  // Escuchar config (si no existía ya)
  if (!listeners.configUnsub) {
    const configRef = ref(db, "config");
    listeners.configUnsub = onValue(configRef, (snapshot) => {
      setConfig(snapshot.val());
    }, (err) => {
      console.error("Error onValue config:", err);
    });
  }

  listeners.lastEspIP = espIP;
  alert("✅ Conectado al ESP con IP: " + espIP);
};

// Desconectar (elimino listeners y limpio estados en UI)
export const desconectarESP = (setSensores, setConectado) => {
  if (listeners.sensoresUnsub) {
    try { listeners.sensoresUnsub(); } catch (e) {}
    listeners.sensoresUnsub = null;
  }
  // no removemos configUnsub porque queremos seguir recibiendo cambios de config global;
  // si prefieres desconectar todo, descomenta:
  // if (listeners.configUnsub) { listeners.configUnsub(); listeners.configUnsub = null; }

  listeners.lastEspIP = null;
  setSensores(null);
  setConectado(false);
  alert("❌ ESP Desconectado");
};

// Guardar configuración (actualiza nodo 'config')
export const guardarConfig = (config) => {
  const configRef = ref(db, "config");
  // Normalizamos y parseamos a int cuando corresponde
  const payload = {
    umbralMin: config.umbralMin !== undefined ? parseInt(config.umbralMin) : null,
    umbralMax: config.umbralMax !== undefined ? parseInt(config.umbralMax) : null,
    tiempoRiego: config.tiempoRiego !== undefined ? parseInt(config.tiempoRiego) : null,
    tiempoEspera: config.tiempoEspera !== undefined ? parseInt(config.tiempoEspera) : null,
  };
  // eliminamos campos null para no sobreescribir con null
  Object.keys(payload).forEach(k => payload[k] === null && delete payload[k]);

  return update(configRef, payload)
    .then(() => {
      alert("💾 Configuración guardada");
    })
    .catch((err) => {
      console.error("guardarConfig error:", err);
      alert("Error guardando configuración");
      throw err;
    });
};

// Cambiar modo (toggle)
export const cambiarModo = (modoActual) => {
  const configRef = ref(db, "config");
  return update(configRef, { modoAutomatico: !modoActual })
    .then(() => {
      alert("Modo actualizado");
    })
    .catch(err => {
      console.error("cambiarModo error:", err);
      alert("Error al cambiar modo");
      throw err;
    });
};

// Control manual de bomba
export const controlBomba = (estado) => {
  const configRef = ref(db, "config");
  return update(configRef, { bombaManual: estado, modoAutomatico: false })
    .then(() => {
      // no alert aquí para evitar spam si se llama muchas veces desde UI
      console.log("controlBomba:", estado);
    })
    .catch(err => {
      console.error("controlBomba error:", err);
      throw err;
    });
};
