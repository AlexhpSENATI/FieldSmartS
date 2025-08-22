import React from "react";

function Control() {
    return (
        <div className="tab-content">
            <h2>Panel de Control</h2>
            <div className="control-section">
                <div className="control-grid">
                    <div className="control-group">
                        <div className="control-title">⚡ Control Manual de Bomba</div>
                        <button className="btn success" onClick={() => window.controlarBomba(true)}>🟢 Encender</button>
                        <button className="btn danger" onClick={() => window.controlarBomba(false)}>🔴 Apagar</button>
                    </div>

                    <div className="control-group">
                        <div className="control-title">🤖 Modo de Operación</div>
                        <select className="form-input" id="modo-automatico">
                            <option value="true">Activado</option>
                            <option value="false">Desactivado</option>
                        </select>
                        <button className="btn" onClick={() => window.cambiarModo()}>🔄 Cambiar Modo</button>
                    </div>

                    <div className="control-group">
                        <div className="control-title">⚙️ Configuración de Riego</div>
                        <input type="number" className="form-input" id="umbral-humedad" min="0" max="100" defaultValue="40" />
                        <button className="btn warning" onClick={() => window.actualizarUmbral()}>💾 Guardar Umbral</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Control;
