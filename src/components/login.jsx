import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadUsers, saveUsers } from "../storage";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleRegister(e) {
    e.preventDefault();
    const users = loadUsers();

    if (users.find((u) => u.email === email.toLowerCase())) {
      setMessage("Ese correo ya está registrado.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name || email.split("@")[0],
      email: email.toLowerCase(),
      password,
    };

    users.push(newUser);
    saveUsers(users);

    setMessage("Registro exitoso. Ahora puedes iniciar sesión.");
    setIsRegister(false);
    setEmail("");
    setPassword("");
    setName("");
  }

  function handleLogin(e) {
    e.preventDefault();
    const users = loadUsers();
    const user = users.find(
      (u) => u.email === email.toLowerCase() && u.password === password
    );

    if (!user) {
      setMessage("Credenciales inválidas.");
      return;
    }

    login(user);       
    navigate("/dashboard");
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-96 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">
          {isRegister ? "Registro" : "Login"}
        </h2>

        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          {isRegister && (
            <div className="mb-3">
              <label>Nombre</label>
              <input
                className="w-full border p-2 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Contraseña</label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && <p className="text-red-600 text-sm">{message}</p>}

          <button className="bg-blue-600 text-white w-full py-2 rounded mt-2">
            {isRegister ? "Registrar" : "Entrar"}
          </button>
        </form>

        <button
          className="mt-3 text-sm underline"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </button>
      </div>
    </div>
  );
}
