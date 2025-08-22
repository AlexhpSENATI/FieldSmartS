import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/sidebar.css"; // Importamos el CSS completo

function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>
                    <i className="fas fa-chart-line"></i> Mi Dashboard
                </h2>
            </div>
            <ul>
                <li>
                    <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                        <i className="fas fa-home"></i> Inicio
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/reportes" className={({ isActive }) => (isActive ? "active" : "")}>
                        <i className="fas fa-chart-bar"></i> Reportes
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/configuracion" className={({ isActive }) => (isActive ? "active" : "")}>
                        <i className="fas fa-cog"></i> Configuración
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/mensajes" className={({ isActive }) => (isActive ? "active" : "")}>
                        <i className="fas fa-envelope"></i> Mensajes
                    </NavLink>
                </li>
            </ul>
            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">JD</div>
                    <div>
                        <div style={{ fontWeight: 500 }}>Juan Díaz</div>
                        <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Administrador</div>
                    </div>
                </div>
                <a href="#" className="logout-btn">
                    <i className="fas fa-sign-out-alt"></i> Cerrar sesión
                </a>
            </div>
        </div>
    );
}

export default Sidebar;
