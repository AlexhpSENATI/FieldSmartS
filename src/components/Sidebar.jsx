// src/components/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaCogs,
  FaWrench,
  FaClipboardList,
} from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/Inicio");
  };

  // Menú con control por roles
  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: FaHome, roles: ["admin", "user","analyst"] },
    { path: "/estadisticas", label: "Estadísticas", icon: FaChartBar, roles: ["admin"] },
    { path: "/control", label: "Control", icon: FaCogs, roles: ["admin","analyst"] },
    { path: "/configuracion", label: "Configuración", icon: FaWrench, roles: ["admin"] },
    { path: "/logs", label: "Logs", icon: FaClipboardList, roles: ["admin", "user","analyst"] },
  ];

  return (
    <div className="sidebar">
      {/*============================= LOGO =============================*/}
      <div className="logo-container">
        <div className="logo">
          <FaHome color="#ebebebff" size={24} />
        </div>
        <div className="brand-name">FIELDSMART</div>
      </div>

      {/*============================= MENÚ =============================*/}
      <ul className="nav-menu">
        {menuItems
          .filter((item) => item.roles.includes(currentUser?.role)) // solo lo que puede ver
          .map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
      </ul>

      {/*============================= BOTÓN CERRAR =============================*/}
      <button className="logout-btn" onClick={handleLogout}>
        <MdLogout size={14} />
        <span>Cerrar</span>
      </button>
    </div>
  );
};

export default Sidebar;

// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   FaHome,
//   FaChartBar,
//   FaCogs,
//   FaWrench,
//   FaClipboardList,
// } from "react-icons/fa";
// import { MdLogout } from "react-icons/md";
// import { useAuth } from "../context/AuthContext";

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const { logout } = useAuth();

//   const handleLogout = () => {
//     logout();
//     navigate("/Inicio");
//   };

//   const menuItems = [
//     { path: "/dashboard", label: "Dashboard", icon: FaHome },
//     { path: "/estadisticas", label: "Estadísticas", icon: FaChartBar },
//     { path: "/control", label: "Control", icon: FaCogs },
//     { path: "/configuracion", label: "Configuración", icon: FaWrench },
//     { path: "/logs", label: "Logs", icon: FaClipboardList },
//   ];

//   return (
//     <div className="sidebar">
//       {/*=============================LOGO SIDEBAR=====================   */}
//       <div className="logo-container">
//         <div className="logo">
//           <FaHome color="#121212" size={24} />
//         </div>
//         <div className="brand-name">FIELDSMART</div>
//       </div>

//       {/*=============================MENU============================= */}
//       <ul className="nav-menu">
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           return (
//             <li key={item.path}>
//               <NavLink
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `nav-item ${isActive ? "active" : ""}`
//                 }
//               >
//                 <Icon size={16} />
//                 <span>{item.label}</span>
//               </NavLink>
//             </li>
//           );
//         })}
//       </ul>

//       {/*=============================BOTON CERRAR============================= */}
//       <button className="logout-btn" onClick={handleLogout}>
//         <MdLogout size={14} />
//         <span>Cerrar</span>
//       </button>
//     </div>
//   );
// };

// export default Sidebar;

// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   FaHome,
//   FaChartBar,
//   FaCogs,
//   FaWrench,
//   FaClipboardList,
// } from "react-icons/fa";
// import { MdLogout } from "react-icons/md";
// import { useAuth } from "../context/AuthContext"; // importa tu contexto

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const { logout } = useAuth(); // función de logout del contexto

//   // Acción al cerrar sesión
//   const handleLogout = () => {
//     logout(); // limpia el usuario del contexto
//     navigate("/login"); // redirige al login
//   };

//   const menuItems = [
//     { path: "/dashboard", label: "Dashboard", icon: FaHome },
//     { path: "/estadisticas", label: "Estadísticas", icon: FaChartBar },
//     { path: "/control", label: "Control", icon: FaCogs },
//     { path: "/configuracion", label: "Configuración", icon: FaWrench },
//     { path: "/logs", label: "Logs", icon: FaClipboardList },
//   ];

//   return (
//     <div className="sidebar">
//       {/* Logo */}
//       <div className="logo-container">
//         <div className="logo">
//           <FaHome color="#121212" size={24} />
//         </div>
//         <div className="brand-name">FIELDSMART</div>
//       </div>

//       {/* Menú de navegación */}
//       <ul className="nav-menu">
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           return (
//             <li key={item.path}>
//               <NavLink
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `nav-item ${isActive ? "active" : ""}`
//                 }
//               >
//                 <Icon size={16} />
//                 <span>{item.label}</span>
//               </NavLink>
//             </li>
//           );
//         })}
//       </ul>

//       {/* Botón de cierre */}
//       <button className="logout-btn" onClick={handleLogout}>
//         <MdLogout size={14} />
//         <span>Cerrar</span>
//       </button>
//     </div>
//   );
// };

// export default Sidebar;

// import React from "react";
// import { NavLink } from "react-router-dom";
// import { FaHome, FaChartBar, FaCogs, FaWrench, FaClipboardList } from "react-icons/fa";
// import { MdLogout } from "react-icons/md";

// const Sidebar = () => {
//   const menuItems = [
//     { path: "/dashboard", label: "Dashboard", icon: FaHome },
//     { path: "/estadisticas", label: "Estadísticas", icon: FaChartBar },
//     { path: "/control", label: "Control", icon: FaCogs },
//     { path: "/configuracion", label: "Configuración", icon: FaWrench },
//     { path: "/logs", label: "Logs", icon: FaClipboardList },
//   ];

//   return (
//     <div className="sidebar">
//       {/* Logo */}
//       <div className="logo-container">
//         <div className="logo">
//           <FaHome color="#121212" size={24} />
//         </div>
//         <div className="brand-name">FIELDSMART</div>
//       </div>

//       {/* Menú de navegación */}
//       <ul className="nav-menu">
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           return (
//             <li key={item.path}>
//               <NavLink
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `nav-item ${isActive ? "active" : ""}`
//                 }
//               >
//                 <Icon size={16} />
//                 <span>{item.label}</span>
//               </NavLink>
//             </li>
//           );
//         })}
//       </ul>

//       {/* Botón de cierre */}
//       <button className="logout-btn">
//         <MdLogout size={14} />
//         <span>Cerrar</span>
//       </button>
//     </div>
//   );
// };

// export default Sidebar;


// import React from 'react';

// const Sidebar = ({ activeTab, onTabChange }) => {
//   const menuItems = [
//     { id: 'Dashboard', label: 'Dashboard', icon: '🏠' },
//     { id: 'Estadisticas', label: 'Estadísticas', icon: '📊' },
//     { id: 'Control', label: 'Control', icon: '⚙️' },
//     { id: 'Configuracion', label: 'Configuración', icon: '🔧' },
//     { id: 'Logs', label: 'Logs', icon: '📝' },
//   ];

//   return (
//     <div className="sidebar">
//       {/* Logo */}
//       <div className="logo-container">
//         <div className="logo">
//           {/* Puedes reemplazar esto con una imagen */}
//           <span>🌾</span>
//         </div>
//         <div className="brand-name">FIELDSMART</div>
//       </div>

//       {/* Menú de navegación */}
//       <ul className="nav-menu">
//         {menuItems.map((item) => (
//           <li key={item.id}>
//             <div
//               className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
//               onClick={() => onTabChange(item.id)}
//             >
//               <span>{item.icon}</span>
//               <span>{item.label}</span>
//             </div>
//           </li>
//         ))}
//       </ul>

//       {/* Botón de cierre (siempre abajo) */}
//       <button className="logout-btn">
//         <span>🚪</span>
//         <span>Cerrar</span>
//       </button>
//     </div>
//   );
// };

// export default Sidebar;
// src/components/Sidebar.js
// import React from 'react';

// // Importamos los íconos que necesitamos
// import { FaHome, FaChartBar, FaCogs, FaWrench, FaClipboardList } from 'react-icons/fa';
// import { MdLogout } from 'react-icons/md';

// const Sidebar = ({ activeTab, onTabChange }) => {
//   const menuItems = [
//     { id: 'Dashboard', label: 'Dashboard', icon: FaHome },
//     { id: 'Estadisticas', label: 'Estadísticas', icon: FaChartBar },
//     { id: 'Control', label: 'Control', icon: FaCogs },
//     { id: 'Configuracion', label: 'Configuración', icon: FaWrench },
//     { id: 'Logs', label: 'Logs', icon: FaClipboardList },
//   ];

//   return (
//     <div className="sidebar">
//       {/* Logo */}
//       <div className="logo-container">
//         <div className="logo">
//           <FaHome color="#121212" size={24} />
//         </div>
//         <div className="brand-name">FIELDSMART</div>
//       </div>

//       {/* Menú de navegación */}
//       <ul className="nav-menu">
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           return (
//             <li key={item.id}>
//               <div
//                 className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
//                 onClick={() => onTabChange(item.id)}
//               >
//                 <Icon size={16} />
//                 <span>{item.label}</span>
//               </div>
//             </li>
//           );
//         })}
//       </ul>

//       {/* Botón de cierre (siempre abajo) */}
//       <button className="logout-btn">
//         <MdLogout size={14} />
//         <span>Cerrar</span>
//       </button>
//     </div>
//   );
// };

// export default Sidebar;

// import React from "react";
// import { NavLink } from "react-router-dom";
// import { FaChartLine, FaHome, FaChartBar, FaCog, FaEnvelope, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";

// export default function Sidebar({ isOpen }) {
//     return (
//         <div className={`sidebar ${isOpen ? "active" : ""}`}>
//             <div className="sidebar-header">
//                 <h2><FaChartLine style={{ marginRight: "10px", color: "#60a5fa" }} /> Mi Dashboard</h2>
//             </div>

//             <ul>
//                 <li>
//                     <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
//                         <FaHome /> Dashboard
//                     </NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/control" end className={({ isActive }) => (isActive ? "active" : "")}>
//                         <FaTachometerAlt /> Control
//                     </NavLink>
//                 </li>

//                 <li>
//                     <NavLink to="/configuracion" className={({ isActive }) => (isActive ? "active" : "")}>
//                         <FaCog /> Configuración
//                     </NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/logs" className={({ isActive }) => (isActive ? "active" : "")}>
//                         <FaChartBar /> Logs
//                     </NavLink>
//                 </li>

//                 <li>
//                     <NavLink to="/mensajes" className={({ isActive }) => (isActive ? "active" : "")}>
//                         <FaEnvelope /> Mensajes
//                     </NavLink>
//                 </li>

//             </ul>

//             <div className="sidebar-footer">
//                 <div className="user-info">
//                     <div className="user-avatar">HP</div>
//                     <div>
//                         <div style={{ fontWeight: 500 }}>Alex Hidalgo</div>
//                         <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Administrador</div>
//                     </div>
//                 </div>
//                 <a className="logout-btn"><FaSignOutAlt /> Cerrar sesión</a>
//             </div>
//         </div>
//     );
// }
