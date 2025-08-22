import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('inicio');

  const renderContent = () => {
    switch(activePage) {
      case 'inicio':
        return (
          <div>
            <h1>Bienvenido al Panel</h1>
            <div className="card-grid">
              <div className="card">
                <div className="card-icon blue">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Usuarios Activos</h3>
                <p className="stat">1,254</p>
              </div>
              <div className="card">
                <div className="card-icon green">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <h3>Ventas Totales</h3>
                <p className="stat">$42,865</p>
              </div>
              <div className="card">
                <div className="card-icon orange">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Crecimiento</h3>
                <p className="stat">+28.5%</p>
              </div>
              <div className="card">
                <div className="card-icon purple">
                  <i className="fas fa-tasks"></i>
                </div>
                <h3>Tareas Completadas</h3>
                <p className="stat">86%</p>
              </div>
            </div>
          </div>
        );
      case 'reportes':
        return (
          <div>
            <h1>Reportes y Estadísticas</h1>
            <div className="content-card">
              <h2>Reporte de Ventas</h2>
              <p>Análisis detallado de las ventas del último trimestre.</p>
            </div>
            <div className="content-card">
              <h2>Estadísticas de Usuarios</h2>
              <p>Comportamiento y engagement de los usuarios en la plataforma.</p>
            </div>
          </div>
        );
      case 'configuracion':
        return (
          <div>
            <h1>Configuración del Sistema</h1>
            <div className="content-card">
              <h2>Preferencias de Usuario</h2>
              <p>Ajusta las preferencias y configuraciones de tu cuenta.</p>
            </div>
          </div>
        );
      case 'mensajes':
        return (
          <div>
            <h1>Mensajes y Notificaciones</h1>
            <div className="content-card">
              <h2>Bandeja de Entrada</h2>
              <p>Gestiona tus mensajes recibidos y notificaciones del sistema.</p>
            </div>
          </div>
        );
      default:
        return <h1>Página no encontrada</h1>;
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2><i className="fas fa-chart-line"></i> Mi Dashboard</h2>
        </div>
        <ul>
          <li>
            <button 
              className={activePage === 'inicio' ? 'active' : ''} 
              onClick={() => setActivePage('inicio')}
            >
              <i className="fas fa-home"></i> Inicio
            </button>
          </li>
          <li>
            <button 
              className={activePage === 'reportes' ? 'active' : ''} 
              onClick={() => setActivePage('reportes')}
            >
              <i className="fas fa-chart-bar"></i> Reportes
            </button>
          </li>
          <li>
            <button 
              className={activePage === 'configuracion' ? 'active' : ''} 
              onClick={() => setActivePage('configuracion')}
            >
              <i className="fas fa-cog"></i> Configuración
            </button>
          </li>
          <li>
            <button 
              className={activePage === 'mensajes' ? 'active' : ''} 
              onClick={() => setActivePage('mensajes')}
            >
              <i className="fas fa-envelope"></i> Mensajes
            </button>
          </li>
        </ul>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">JD</div>
            <div>
              <div className="user-name">Juan Díaz</div>
              <div className="user-role">Administrador</div>
            </div>
          </div>
          <button className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Cerrar sesión
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;v