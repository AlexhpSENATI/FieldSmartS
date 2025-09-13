import React, { useState, useEffect } from 'react';
import "./styles/sidebar.css";
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ContentArea from './components/ContentArea';

import { EstadisticasProvider } from "./context/EstadisticasContext";
import Dashboard from './components/pages/Dashboard';
import Estadisticas from './components/pages/Estadisticas';
import Control from './components/pages/Control';
// import Configuracion from './components/pages/Configuracion';
// import Logs from './components/pages/Logs';

// import { iniciarMonitoreo } from "./notificaciones";

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  // useEffect(() => {
  //   iniciarMonitoreo();
  // }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Estadisticas':
        return (
          <EstadisticasProvider>
            <Estadisticas />
          </EstadisticasProvider>
        );
      case 'Control':
        return <Control />;
      case 'Configuracion':
        return <Configuracion />;
      case 'Logs':
        return <Logs />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="app">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="main-content">
          <Header />
          <ContentArea>
            {renderContent()}
          </ContentArea>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;


// // src/App.jsx
// import React, { useEffect, useState } from "react";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AppProvider } from './context/AppContext';
// import Sidebar from "./components/Sidebar";
// import Topbar from "./components/Topbar";
// import Inicio from "./components/Pages/Dashboard";
// import Control from "./components/Pages/Control";
// import Logs from "./components/Pages/Logs";
// import Configuracion from "./components/Pages/Configuracion";
// import Mensajes from "./pages/Mensajes";
// import "./styles/sidebar.css";

// export default function App() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 992) setSidebarOpen(false);
//       else setSidebarOpen(true);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <AppProvider>
//       <Router>
//         <div className="app">
//           <Sidebar isOpen={sidebarOpen} />
//           <div className={`main-content ${sidebarOpen ? "" : "no-margin"}`}>
//             <Topbar onToggleMenu={() => setSidebarOpen((v) => !v)} />
//             <div className="content-area">
//               <Routes>
//                 <Route path="/" element={<Inicio />} />
//                 <Route path="/control" element={<Control />} />
//                 <Route path="/logs" element={<Logs />} />
//                 <Route path="/configuracion" element={<Configuracion />} />
//                 <Route path="/mensajes" element={<Mensajes />} />
//               </Routes>
//             </div>
//             <div className="alerts-container">
//               {/* Alerts will be rendered here via context, but since it's global, perhaps move to here if needed */}
//             </div>
//           </div>
//         </div>
//       </Router>
//     </AppProvider>
//   );
// }





// import React, { useEffect, useState } from "react";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
// import Header from "./components/Header";
// import Topbar from "./components/Topbar";
// import Inicio from "./components/Tabs/Dashboard";
// import Control from "./components/Tabs/Control";
// import Logs from "./components/Tabs/Logs";
// import Configuracion from "./components/Tabs/Configuracion";
// import Mensajes from "./pages/Mensajes";
// import "./styles/sidebar.css";

// export default function App() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 992) setSidebarOpen(false);
//       else setSidebarOpen(true);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <Router>
//       <div className="app">
//         <Sidebar isOpen={sidebarOpen} />
//         <div className={`main-content ${sidebarOpen ? "" : "no-margin"}`}>
//           <Topbar onToggleMenu={() => setSidebarOpen((v) => !v)} />
//           <div className="content-area">
//             <Routes>
//               <Route path="/" element={<Inicio />} />
//               <Route path="/control" element={<Control />} />
//               <Route path="/logs" element={<Logs />} />
//               <Route path="/configuracion" element={<Configuracion />} />
//               <Route path="/mensajes" element={<Mensajes />} />
//             </Routes>
//           </div>
//         </div>
//       </div>
//     </Router>
//   );
// }
