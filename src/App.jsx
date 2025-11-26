import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/Sidebar.css";

import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { EstadisticasProvider } from "./context/EstadisticasContext";
import { MessagesProvider } from "./context/MessagesContext";

import PrivateRoute from "./PrivateRoute";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ContentArea from "./components/ContentArea";
import ChatbotFloat from "./components/ChatbotFloat";

import Inicio from "./Inicio";
import Login from "./components/login";
import Dashboard from "./components/pages/Dashboard";
import Estadisticas from "./components/pages/Estadisticas";
import Control from "./components/pages/Control";
import Configuracion from "./components/pages/AdminRoles";
import Mensaje from "./components/pages/Mensaje";
// import Chatbot from "./components/pages/Chatbot";

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
          <ChatbotFloat />

          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />

            {/* RUTAS PROTEGIDAS CORRECTAS */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <PrivateLayout>
                    <Dashboard />
                  </PrivateLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/estadisticas"
              element={
                <PrivateRoute>
                  <PrivateLayout>
                    <EstadisticasProvider>
                      <Estadisticas />
                    </EstadisticasProvider>
                  </PrivateLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/control"
              element={
                <PrivateRoute>
                  <PrivateLayout>
                    <Control />
                  </PrivateLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/configuracion"
              element={
                <PrivateRoute>
                  <PrivateLayout>
                    <Configuracion />
                  </PrivateLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/mensaje"
              element={
                <PrivateRoute>
                  <PrivateLayout>
                    <Mensaje />
                  </PrivateLayout>
                </PrivateRoute>
              }
            />

            {/* <Route
              path="/chatbot"
              element={
                <PrivateRoute>
                  <PrivateLayout>
                    <Chatbot />
                  </PrivateLayout>
                </PrivateRoute>
              }
            /> */}

            {/* Default */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </MessagesProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
