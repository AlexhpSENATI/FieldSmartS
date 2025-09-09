import React from 'react';
// Importa Material Design Icons
import { MdOutlineNotifications, MdSettings } from 'react-icons/md';
import { FaSearch } from 'react-icons/fa';

const Header = () => {
    return (
        <header className="header">
            {/* Barra de búsqueda */}
            <div className="search-bar">
                <FaSearch className="search-icon" size={18} />
                <input type="text" placeholder="Buscar" />
            </div>

            {/* Iconos de acción */}
            <div className="header-icons">
                <button>
                    <MdOutlineNotifications size={24} />
                </button>
                <button>
                    <MdSettings size={24} />
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
