import React from "react";

function Topbar() {
  return (
    <div className="topbar">
      <button className="menu-toggle">
        <i className="fas fa-bars"></i>
      </button>
      <div className="search-box">
        <i className="fas fa-search"></i>
        <input type="text" placeholder="Buscar..." />
      </div>
      <div className="user-menu">
        <div className="notification-bell">
          <i className="fas fa-bell"></i>
          <span className="badge">3</span>
        </div>
        <div className="user-avatar" style={{ background: "#10b981" }}>JD</div>
      </div>
    </div>
  );
}

export default Topbar;
