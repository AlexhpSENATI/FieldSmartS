import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/sidebar.css";

import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { EstadisticasProvider } from "./context/EstadisticasContext";
import { MessagesProvider } from "./context/MessagesContext";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ContentArea from "./components/ContentArea";

import Inicio from "./Inicio";
import Login from "./components/login";
import Dashboard from "./components/pages/Dashboard";
import Estadisticas from "./components/pages/Estadisticas";
import Control from "./components/pages/Control";
import Configuracion from "./components/pages/AdminRoles";
import Mensaje from "./components/pages/Mensaje"
// import Inicio from "./Inicio";

function PrivateLayout({ children }) {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header />
        <ContentArea>{children}</ContentArea>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MessagesProvider>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <PrivateLayout>
                  <Dashboard />
                </PrivateLayout>
              }
            />
            <Route
              path="/estadisticas"
              element={
                <PrivateLayout>
                  <EstadisticasProvider>
                    <Estadisticas />
                  </EstadisticasProvider>
                </PrivateLayout>
              }
            />
            <Route
              path="/control"
              element={
                <PrivateLayout>
                  <Control />
                </PrivateLayout>
              }
            />
            <Route
              path="/configuracion"
              element={
                <PrivateLayout>
                  <Configuracion />
                </PrivateLayout>
              }
            />
            <Route
              path="/mensaje"
              element={
                <PrivateLayout>
                  <Mensaje />
                </PrivateLayout>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </MessagesProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;


// import React, { useState, useEffect } from 'react';

// import "bootstrap-icons/font/bootstrap-icons.css";
// import "./styles/sidebar.css";
// import { AppProvider } from './context/AppContext';
// import Sidebar from './components/Sidebar';
// import Header from './components/Header';
// import ContentArea from './components/ContentArea';

// import { EstadisticasProvider } from "./context/EstadisticasContext";
// import Dashboard from './components/pages/Dashboard';
// import Estadisticas from './components/pages/Estadisticas';
// import Control from './components/pages/Control';
// import Configuracion from './components/pages/Configuracion';

// import Home from './home';
// import Login from './login';

// // import Logs from './components/pages/Logs';

// // import { iniciarMonitoreo } from "./notificaciones";

// function App() {
//   const [activeTab, setActiveTab] = useState('Dashboard');

//   // useEffect(() => {
//   //   iniciarMonitoreo();
//   // }, []);

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'Dashboard':
//         return <Dashboard />;
//       case 'Estadisticas':
//         return (
//           <EstadisticasProvider>
//             <Estadisticas />
//           </EstadisticasProvider>
//         );
//       case 'Control':
//         return <Control />;
//       case 'Configuracion':
//         return <Configuracion />;
//       case 'Logs':
//         return <Logs />;
//       default:
//         return <Dashboard />;
//     }
//   };

//   return (
//     <AppProvider>
//       <div className="app">
//         <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
//         <div className="main-content">
//           <Header />
//           <ContentArea>
//             {renderContent()}
//           </ContentArea>
//         </div>
//       </div>
//     </AppProvider>
//   );
// }

// export default App;





