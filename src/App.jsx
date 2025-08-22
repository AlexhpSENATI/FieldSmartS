
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Inicio from "./pages/Inicio";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";
import Mensajes from "./pages/Mensajes";

function App() {
  return (
    <Router>
      <div className="dashboard" style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Contenido principal */}
        <div className="main-content" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Topbar />
          <div className="content-area" style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
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

export default App;










// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import SistemaRiego from "./SistemaRiego";
// importa tu archivo nuevo



// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>

//       <div>
//         <SistemaRiego />
//       </div>

//     </>
//   )
// }

// export default App
