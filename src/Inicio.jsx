import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaYoutube } from "react-icons/fa";
import "./styles/Inicio.css";
import { registerUser, loginUser, loginWithGoogle } from "./services/authService";

export default function Home() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "unset";
  }, [showModal]);


  // --- Mapeo de errores de Firebase a mensajes en español ---
  function getErrorMessage(code) {
    switch (code) {
      case "auth/invalid-email":
        return "Correo electrónico no válido";
      case "auth/user-disabled":
        return "El usuario ha sido deshabilitado";
      case "auth/user-not-found":
        return "Usuario no encontrado";
      case "auth/wrong-password":
        return "Contraseña incorrecta";
      case "auth/email-already-in-use":
        return "El correo ya está en uso";
      case "auth/weak-password":
        return "La contraseña es muy débil";
      case "auth/popup-closed-by-user":
        return "Has cerrado la ventana de autenticación";
      case "auth/invalid-credential":
        return "Credenciales inválidas";
      default:
        return "Ocurrió un error inesperado";
    }
  }

  // --- Registro ---
  async function handleRegister(e) {
    e.preventDefault();
    try {
      const result = await registerUser(name, email, password, "user");

      if (result.success) {
        setMessage(" Registro exitoso. Ahora puedes iniciar sesión.");
        setTimeout(() => {
          setIsRegister(false);
          setEmail("");
          setPassword("");
          setName("");
          setMessage("");
        }, 1500);
      } else {
        const friendlyMessage = getErrorMessage(result.message || result.code);
        setMessage(`❌ ${friendlyMessage}`);
      }
    } catch (error) {
      const friendlyMessage = getErrorMessage(error.code);
      setMessage(`❌ ${friendlyMessage}`);
    }
  }

  // --- Login ---
  async function handleLogin(e) {
    e.preventDefault();

    if (typeof email !== "string" || typeof password !== "string") {
      setMessage("❌ Email o contraseña inválidos");
      return;
    }

    try {
      const result = await loginUser(email.trim(), password.trim());

      if (!result.success) {
        const friendlyMessage = getErrorMessage(result.message || result.code);
        setMessage(`❌ ${friendlyMessage}`);
        return;
      }

      login(result.user);
      setShowModal(false);
      navigate("/dashboard");
    } catch (error) {
      const friendlyMessage = getErrorMessage(error.code);
      setMessage(`❌ ${friendlyMessage}`);
    }
  }

  // --- Login con Google ---
  async function handleGoogleLogin() {
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        const friendlyMessage = getErrorMessage(result.message || result.code);
        setMessage(`❌ ${friendlyMessage}`);
      } else {
        setMessage("✅ Bienvenido " + (result.user.displayName || ""));
        login(result.user);
        setShowModal(false);
        navigate("/dashboard");
      }
    } catch (error) {
      const friendlyMessage = getErrorMessage(error.code);
      setMessage(`❌ ${friendlyMessage}`);
    }
  }

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <h1 className="logo">FieldSmart</h1>
        </div>
        <nav className="nav">
          <a href="#features">Características</a>
          <a href="#about">Acerca de</a>
          <a href="#contact">Contacto</a>
        </nav>
        <button
          className="btn-login"
          onClick={() => {
            setShowModal(true);
            setIsRegister(false);
            setMessage("");
          }}
        >
          Iniciar Sesión
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="gold-accent-line"></div>
          <h1>
            Gestión de campo <span className="gold-text">excepcional</span>
          </h1>
          <p>
            La plataforma premium para profesionales que exigen lo mejor en gestión de proyectos en campo.
          </p>
          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => {
                setShowModal(true);
                setIsRegister(false);
                setMessage("");
              }}
            >
              Comenzar ahora
            </button>
            <button className="btn-secondary">
              <span className="btn-icon">▶</span> Ver demostración
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1">
            <div className="card-icon">📊</div>
            <p>Dashboard avanzado</p>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">📱</div>
            <p>App móvil incluida</p>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">👥</div>
            <p>Gestión de equipos</p>
          </div>
          <div className="main-visual">
            <div className="circle-background"></div>
            <div className="device-mockup">
              <div className="screen-content">
                <div className="data-row"></div>
                <div className="data-row"></div>
                <div className="data-row"></div>
                <div className="chart-container">
                  <div className="chart-bar"></div>
                  <div className="chart-bar"></div>
                  <div className="chart-bar"></div>
                  <div className="chart-bar"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-header">
          <div className="gold-accent-line center"></div>
          <h2>
            Características <span className="gold-text">Exclusivas</span>
          </h2>
          <p>Diseñado para los profesionales más exigentes</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>Experiencia Premium</h3>
            <p>Interfaz elegante y refinada con atención a cada detalle de diseño.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Seguridad Elite</h3>
            <p>Protección de nivel empresarial para tus datos más sensibles.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Analítica Avanzada</h3>
            <p>Dashboards inteligentes con información procesable en tiempo real.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Rendimiento Optimizado</h3>
            <p>Tecnología de vanguardia para una experiencia fluida y rápida.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-header">
          <div className="gold-accent-line center"></div>
          <h2>
            Opiniones de <span className="gold-text">Clientes</span>
          </h2>
        </div>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="stars">★★★★★</div>
              <p>
                "FieldSmart transformó completamente nuestra gestión de proyectos. La elegancia y
                funcionalidad son incomparables."
              </p>
              <div className="client">
                <div className="client-avatar"></div>
                <div className="client-info">
                  <h4>Carlos Mendoza</h4>
                  <p>Director de Operaciones</p>
                </div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="stars">★★★★★</div>
              <p>
                "La interfaz es tan intuitiva como poderosa. Hemos reducido nuestro tiempo de gestión en
                un 40% desde que implementamos FieldSmart."
              </p>
              <div className="client">
                <div className="client-avatar"></div>
                <div className="client-info">
                  <h4>Ana Rodríguez</h4>
                  <p>Gerente de Proyectos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-luxury-border">
              <div className="luxury-corner tl"></div>
              <div className="luxury-corner tr"></div>
              <div className="luxury-corner bl"></div>
              <div className="luxury-corner br"></div>

              <div className="modal-content">
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  ✖
                </button>

                <div className="modal-header">
                  <h2>{isRegister ? "Crear Cuenta" : "Iniciar Sesión"}</h2>
                  <p>
                    {isRegister
                      ? "Regístrate para comenzar"
                      : "Ingresa a tu cuenta para continuar"}
                  </p>
                </div>

                <form onSubmit={isRegister ? handleRegister : handleLogin}>
                  {isRegister && (
                    <div className="input-group">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <label>Nombre completo</label>
                      <span className="input-border"></span>
                    </div>
                  )}

                  <div className="input-group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label>Email</label>
                    <span className="input-border"></span>
                  </div>

                  <div className="input-group">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} // ✅ TAMBIÉN AQUÍ
                      required
                    />
                    <label>Contraseña</label>
                    <span className="input-border"></span>
                  </div>

                  {message && (
                    <div
                      className={`message ${message.includes("❌") ? "error" : "success"}`}
                    >
                      {message}
                    </div>
                  )}

                  <button type="submit" className="submit-btn">
                    <span>{isRegister ? "Registrarse" : "Iniciar Sesión"}</span>
                    <div className="btn-shine"></div>
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
                    {/* Botón Google */}
                    <button
                      type="button"
                      className="google-btn"
                      onClick={handleGoogleLogin}
                    >
                      <FcGoogle size={20} />
                      Google
                    </button>

                    {/* Botón YouTube */}
                    <a
                      href="https://www.youtube.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="youtube-btn"
                    >
                      <FaYoutube size={20} color="#FF0000" />
                      YouTube
                    </a>
                  </div>
                </form>

                <div className="modal-footer">
                  <p>
                    {isRegister ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}
                    <span
                      onClick={() => {
                        setIsRegister(!isRegister);
                        setMessage("");
                      }}
                    >
                      {isRegister ? " Inicia sesión" : " Regístrate"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
