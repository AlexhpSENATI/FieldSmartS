// src/components/Tabs/Control.jsx
import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const ControlTab = () => {
  const { controlarBomba, cambiarModo, actualizarUmbral } = useContext(AppContext);
  const [modoAutomatico, setModoAutomatico] = useState('false');
  const [umbralHumedad, setUmbralHumedad] = useState(40);

  return (
    <div className="tab-content">
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
              <select
                className="form-input"
                value={modoAutomatico}
                onChange={(e) => setModoAutomatico(e.target.value)}
              >
                <option value="true">Activado</option>
                <option value="false">Desactivado</option>
              </select>
            </div>
            <button className="btn" onClick={() => cambiarModo(modoAutomatico === 'true')}>
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
              <input
                type="number"
                className="form-input"
                min="0"
                max="100"
                value={umbralHumedad}
                onChange={(e) => setUmbralHumedad(e.target.value)}
              />
            </div>
            <button className="btn warning" onClick={() => actualizarUmbral(umbralHumedad)}>
              <span>💾</span> Guardar Umbral
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlTab;