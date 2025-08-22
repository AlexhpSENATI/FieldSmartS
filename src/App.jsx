import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Inicio from "./components/Tabs/Dashboard";
import Reportes from "./pages/Reportes";
import Configuracion from "./components/Tabs/Configuracion";
import Mensajes from "./pages/Mensajes";
import "./styles/sidebar.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <div className="app">
        <Sidebar isOpen={sidebarOpen} />
        <div className={`main-content ${sidebarOpen ? "" : "no-margin"}`}>
          <Topbar onToggleMenu={() => setSidebarOpen((v) => !v)} />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/configuracion" element={<Configuracion />} />
              <Route path="/mensajes" element={<Mensajes />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
