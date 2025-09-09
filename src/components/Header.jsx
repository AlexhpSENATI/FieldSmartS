// src/components/Header.js
import React from 'react';

// Importamos los íconos
import { FaSearch } from 'react-icons/fa';
import { FaBell, FaCogs } from 'react-icons/fa';
import { MdOutlineNotifications, MdSettings } from 'react-icons/md';

const Header = () => {
  return (
    <header className="header">
      {/* Barra de búsqueda */}
      <div className="search-bar">
        <FaSearch size={14} color="#999" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        <input type="text" placeholder="Buscar" />
      </div>

      {/* Iconos de acción */}
      <div className="header-icons">
        <button className="icon-btn">
          <MdOutlineNotifications size={18} />
        </button>
        <button className="icon-btn">
          <MdSettings size={18} />
        </button>
        <img
          src="https://randomuser.me/api/portraits/women/45.jpg"
          alt="Usuario"
          className="user-avatar"
        />
      </div>
    </header>
  );
};

export default Header;