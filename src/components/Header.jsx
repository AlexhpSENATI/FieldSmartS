import React from "react";

export default function Header() {
  return (
    <header className="custom-header-123">
      <h1 className="custom-header-123__title">Mi Header Estático</h1>
      <nav className="custom-header-123__nav">
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Servicios</a></li>
          <li><a href="#">Contacto</a></li>
        </ul>
      </nav>

      {/* CSS en el mismo archivo */}
      <style>{`
        .custom-header-123 {
          background-color: #1a1a1a;
          color: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .custom-header-123__title {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .custom-header-123__nav ul {
          display: flex;
          gap: 1rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .custom-header-123__nav a {
          color: white;
          text-decoration: none;
          transition: color 0.3s;
        }

        .custom-header-123__nav a:hover {
          color: #ffcc00;
        }
      `}</style>
    </header>
  );
}
