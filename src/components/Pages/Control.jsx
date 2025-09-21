
import React, { useState, useEffect } from 'react';
import { useAppContext } from './../../context/AppContext';
import '../../styles/Control.css';

//=============================COMPONENTE DE CONTROL============================//
const Control = () => {
  const [umbralMin, setUmbralMin] = useState(0);
  const [umbralMax, setUmbralMax] = useState(0);
  const [tiempoRiego, setTiempoRiego] = useState(0);
  const [tiempoEspera, setTiempoEspera] = useState(0);
  const [selectModoAuto, setSelectModoAuto] = useState('false');
  const { currentConfig, guardarConfig, cambiarModo, controlBomba } = useAppContext();


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
  {/*=============================PANEL DE CONTROL============================*/ }
  return (
    <div className="control-container">
    
      <div className='control-title'>
        <h1>Panel de Control </h1>
      </div>

      {/*=============================SECCIÓN DE CONFIGURACIÓN============================*/}
      <section className="control-section config-section">
        <h2><i className="bi bi-sliders"></i> Configuración del Sistema</h2>
        <div className="config-grid">
          <div className="config-input">
            <label>
              <i className="bi bi-arrow-down-circle"></i> Umbral Mínimo (%)
            </label>
            <input
              type="number"
              value={umbralMin}
              onChange={(e) => setUmbralMin(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="config-input">
            <label>
              <i className="bi bi-arrow-up-circle"></i> Umbral Máximo (%)
            </label>
            <input
              type="number"
              value={umbralMax}
              onChange={(e) => setUmbralMax(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="config-input">
            <label>
              <i className="bi bi-clock"></i> Tiempo de Riego (s)
            </label>
            <input
              type="number"
              value={tiempoRiego}
              onChange={(e) => setTiempoRiego(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="config-input">
            <label>
              <i className="bi bi-hourglass-split"></i> Tiempo de Espera (s)
            </label>
            <input
              type="number"
              value={tiempoEspera}
              onChange={(e) => setTiempoEspera(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <button className="btn btn-save" onClick={handleGuardarConfig}>
          <i className="bi bi-check-circle"></i> Guardar Configuración
        </button>
      </section>
      {/*=============================SECCIÓN DE MODO DE OPERACIÓN============================*/}
      <section className="control-section mode-section">
        <h2><i className="bi bi-cpu"></i> Modo de Operación</h2>
        <div className="mode-controls">
          <select value={selectModoAuto} onChange={(e) => setSelectModoAuto(e.target.value)}>
            <option value="false">Manual</option>
            <option value="true">Automático</option>
          </select>
          <button className="btn btn-mode" onClick={handleCambiarModo}>
            <i className="bi bi-arrow-repeat"></i> Cambiar Modo
          </button>
        </div>
        <div className="mode-info">
          <p>Modo actual: <span className={selectModoAuto === 'true' ? 'mode-auto' : 'mode-manual'}>
            {selectModoAuto === 'true' ? 'Automático' : 'Manual'}
          </span></p>
        </div>
      </section>
      {/*=============================SECCIÓN DE CONTROL MANUAL============================*/}
      <section className="control-section manual-section">
        <h2><i className="bi bi-toggles"></i> Control Manual</h2>
        <div className="pump-controls">
          <button className="btn btn-pump-on" onClick={() => handleControlBomba(true)}>
            <i className="bi bi-play-circle"></i> Encender Bomba
          </button>
          <button className="btn btn-pump-off" onClick={() => handleControlBomba(false)}>
            <i className="bi bi-stop-circle"></i> Apagar Bomba
          </button>
        </div>
      </section>
    </div>
  );
};

export default Control;