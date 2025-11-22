import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/Sidebar.css";

import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { EstadisticasProvider } from "./context/EstadisticasContext";
import { MessagesProvider } from "./context/MessagesContext";

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
import Chatbot from "./components/pages/Chatbot";

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
          {/* ✅ ChatbotFloat va fuera de <Routes> */}
          <ChatbotFloat />

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

            <Route
              path="/chatbot"
              element={
                <PrivateLayout>
                  <Chatbot />
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


// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// import "bootstrap-icons/font/bootstrap-icons.css";
// import "./styles/Sidebar.css";

// import { AppProvider } from "./context/AppContext";
// import { AuthProvider } from "./context/AuthContext";
// import { EstadisticasProvider } from "./context/EstadisticasContext";
// import { MessagesProvider } from "./context/MessagesContext";

// import Sidebar from "./components/Sidebar";
// import Header from "./components/Header";
// import ContentArea from "./components/ContentArea";
// import ChatbotFloat from "./components/ChatbotFloat";
// import Inicio from "./Inicio";
// import Login from "./components/login";
// import Dashboard from "./components/pages/Dashboard";
// import Estadisticas from "./components/pages/Estadisticas";
// import Control from "./components/pages/Control";
// import Configuracion from "./components/pages/AdminRoles";
// import Mensaje from "./components/pages/Mensaje";
// import Chatbot from "./components/pages/Chatbot"


// // import Inicio from "./Inicio";

// function PrivateLayout({ children }) {
//   return (
//     <div className="app">
//       <Sidebar />
//       <div className="main-content">
//         <Header />
//         <ContentArea>{children}</ContentArea>
//       </div>
//     </div>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <AppProvider>
//         <MessagesProvider>
//           <Routes>
//             <Route path="/" element={<Inicio />} />
//             <Route path="/login" element={<Login />} />

//             <Route
//               path="/dashboard"
//               element={
//                 <PrivateLayout>
//                   <Dashboard />
//                 </PrivateLayout>
//               }
//             />
//             <Route
//               path="/estadisticas"
//               element={
//                 <PrivateLayout>
//                   <EstadisticasProvider>
//                     <Estadisticas />
//                   </EstadisticasProvider>
//                 </PrivateLayout>
//               }
//             />
//             <Route
//               path="/control"
//               element={
//                 <PrivateLayout>
//                   <Control />
//                 </PrivateLayout>
//               }
//             />
//             <Route
//               path="/configuracion"
//               element={
//                 <PrivateLayout>
//                   <Configuracion />
//                 </PrivateLayout>
//               }
//             />
//             <Route
//               path="/mensaje"
//               element={
//                 <PrivateLayout>
//                   <Mensaje />
//                 </PrivateLayout>
//               }
//             />
//             <Route
//               path="/chatbot"
//               element={
//                 <PrivateLayout>
//                   <Chatbot />
//                 </PrivateLayout>
//               }
//             />

//             <Route path="*" element={<Navigate to="/" />} />
//               <ChatbotFloat />
//           </Routes>
//         </MessagesProvider>
//       </AppProvider>
//     </AuthProvider>
//   );
// }

// export default App;
