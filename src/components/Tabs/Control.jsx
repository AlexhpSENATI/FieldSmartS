// Control.jsx
import React from "react";

const Control = ({ controlarBomba, cambiarModo, actualizarUmbral }) => {
    return (
        <div id="control" className="tab-content">
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
                            <select className="form-input" id="modo-automatico">
                                <option value="true">Activado</option>
                                <option value="false">Desactivado</option>
                            </select>
                        </div>
                        <button className="btn" onClick={cambiarModo}>
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
                            <input type="number" className="form-input" id="umbral-humedad" min="0" max="100" defaultValue="40" />
                        </div>
                        <button className="btn warning" onClick={actualizarUmbral}>
                            <span>💾</span> Guardar Umbral
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Control;