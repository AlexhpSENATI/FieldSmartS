import React from "react";
import { Search, Bell, Settings } from "lucide-react";

export default function Header() {
  return (
    <header className="custom-header-987">
      {/* Input de búsqueda */}
      <div className="custom-header-987__search">
        <Search className="icon" size={18} />
        <input type="text" placeholder="Buscar" />
      </div>

      {/* Iconos y avatar */}
      <div className="custom-header-987__actions">
        <button className="icon-btn"><Bell size={18} /></button>
        <button className="icon-btn"><Settings size={18} /></button>
        <img
          className="avatar"
          src="https://i.pravatar.cc/40"
          alt="Usuario"
        />
      </div>

      {/* CSS en el mismo archivo */}
      <style>{`
        .custom-header-987 {
          background-color: #16181c;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 0.75rem;
          height: 80px;              /* 🔒 Alto fijo */
          min-height: 60px;
          box-sizing: border-box;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        /* Buscador */
        .custom-header-987__search {
          display: flex;
          align-items: center;
          background: white;
          padding: 0 0.8rem;
          border-radius: 999px;
          width: 280px;
          height: 36px;              /* 🔒 Altura fija */
          box-sizing: border-box;
        }

        .custom-header-987__search .icon {
          color: #777;
          margin-right: 0.5rem;
          flex-shrink: 0;
        }

        .custom-header-987__search input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 0.9rem;
          background: transparent;
        }

        /* Acciones */
        .custom-header-987__actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          height: 100%;
        }

        .custom-header-987__actions .icon-btn {
          background: white;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;             /* 🔒 Altura fija */
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          flex-shrink: 0;
        }

        .custom-header-987__actions .icon-btn:hover {
          background: #e5e5e5;
        }

        .custom-header-987__actions .avatar {
          width: 36px;
          height: 36px;            /* 🔒 Altura fija */
          border-radius: 50%;
          object-fit: cover;
          cursor: pointer;
          flex-shrink: 0;
        }
      `}</style>
    </header>
  );
}
