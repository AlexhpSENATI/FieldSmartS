// Control.jsx (no changes, remains as previous)
import React, { useState, useEffect } from 'react';
import { useAppContext } from './../../context/AppContext';

const Control = () => {
  const [umbralMin, setUmbralMin] = useState(0);
  const [umbralMax, setUmbralMax] = useState(0);
  const [tiempoRiego, setTiempoRiego] = useState(0);
  const [tiempoEspera, setTiempoEspera] = useState(0);
  const [selectModoAuto, setSelectModoAuto] = useState('false');
  const { currentConfig, guardarConfig, cambiarModo, controlBomba } = useAppContext();

  // Update inputs from currentConfig
  useEffect(() => {
    if (currentConfig.umbralMin !== undefined) setUmbralMin(currentConfig.umbralMin);
    if (currentConfig.umbralMax !== undefined) setUmbralMax(currentConfig.umbralMax);
    if (currentConfig.tiempoRiego !== undefined) setTiempoRiego(currentConfig.tiempoRiego);
    if (currentConfig.tiempoEspera !== undefined) setTiempoEspera(currentConfig.tiempoEspera);
    if (currentConfig.modoAutomatico !== undefined) setSelectModoAuto(currentConfig.modoAutomatico ? 'true' : 'false');
  }, [currentConfig]);

  const handleGuardarConfig = () => {
    if (umbralMin === 0 || umbralMax === 0 || tiempoRiego === 0 || tiempoEspera === 0) {
      alert("Por favor, completa todos los campos de configuración.");
      return;
    }
    guardarConfig(umbralMin, umbralMax, tiempoRiego, tiempoEspera);
  };

  const handleCambiarModo = () => {
    cambiarModo(selectModoAuto);
  };

  const handleControlBomba = (estado) => {
    controlBomba(estado);
  };

  return (
    <div>
      <h2>⚙️ Configuración</h2>
      <label>Umbral Min (%): <input type="number" value={umbralMin} onChange={(e) => setUmbralMin(parseInt(e.target.value) || 0)} /></label><br />
      <label>Umbral Max (%): <input type="number" value={umbralMax} onChange={(e) => setUmbralMax(parseInt(e.target.value) || 0)} /></label><br />
      <label>Tiempo Riego (s): <input type="number" value={tiempoRiego} onChange={(e) => setTiempoRiego(parseInt(e.target.value) || 0)} /></label><br />
      <label>Tiempo Espera (s): <input type="number" value={tiempoEspera} onChange={(e) => setTiempoEspera(parseInt(e.target.value) || 0)} /></label><br />
      <button onClick={handleGuardarConfig}>💾 Guardar Configuración</button>

      <h2>⚙️ Modo de Operación</h2>
      <div className="form-row">
        <select value={selectModoAuto} onChange={(e) => setSelectModoAuto(e.target.value)}>
          <option value="false">❌ Desactivado (Manual)</option>
          <option value="true">✅ Activado (Automático)</option>
        </select>
        <button className="control-btn success" onClick={handleCambiarModo}>CAMBIAR</button>
      </div>

      <h2>🔧 Control Manual</h2>
      <button onClick={() => handleControlBomba(true)}>🚰 Encender Bomba</button>
      <button onClick={() => handleControlBomba(false)}>💤 Apagar Bomba</button>
    </div>
  );
};

export default Control;