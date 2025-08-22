import React from "react";

export default function Header() {
  return (
    <div className="header">
      <h1>Sistema de Riego Inteligente</h1>
      <p>Monitoreo completo en tiempo real</p>
      <div className="connection-badge disconnected" id="connectionBadge">
        Desconectado
      </div>
    </div>
  );
}
