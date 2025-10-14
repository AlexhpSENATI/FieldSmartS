import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx"; // 👈 agregamos .jsx
import { AuthProvider } from "./context/AuthContext.jsx"; // 👈 agregamos .jsx

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);



// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
// import "./styles/Sidebar.css"; // aquí metes TODO tu CSS original

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);
