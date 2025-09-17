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
      <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">
          {isRegister ? "Registro" : "Login"}
        </h2>

        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          {isRegister && (
            <div className="login-input-group">
              <label className="login-label">Nombre</label>
              <input
                className="login-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="login-input-group">
            <label className="login-label">Email</label>
            <input
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-input-group">
            <label className="login-label">Contraseña</label>
            <input
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && <p className="login-message">{message}</p>}

          <button className="login-button">
            {isRegister ? "Registrar" : "Entrar"}
          </button>
        </form>

        <button
          className="login-toggle"
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