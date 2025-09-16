import React from "react";
import { Link } from "react-router-dom";

export default function Inicio() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a fieldsmart</h1>
      <p className="mb-6">psgina inicio.</p>
      <Link
        to="/login"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Iniciar sesión
      </Link>
    </div>
  );
}
