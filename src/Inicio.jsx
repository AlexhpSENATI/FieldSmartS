import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadUsers, saveUsers } from "./storage";
import { useAuth } from "./context/AuthContext";
import "./styles/Inicio.css";
import { registerUser, loginUser } from "./services/authService";

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

  //====================REGISTRO CON FIREBASE==================//
  async function handleRegister(e) {
    e.preventDefault();
    const result = await registerUser(name, email, password);

    if (result.success) {
      setMessage("✅ Registro exitoso. Ahora puedes iniciar sesión.");
      setTimeout(() => {
        setIsRegister(false);
        setEmail("");
        setPassword("");
        setName("");
        setMessage("");
      }, 1500);
    } else {
      setMessage(`❌ Error: ${result.message}`);
    }
  }

  //==================LOGIN CON FIREBASE==================//
  async function handleLogin(e) {
    e.preventDefault();
    const result = await loginUser(email, password);

    if (!result.success) {
      setMessage(`❌ Error: ${result.message}`);
      return;
    }

    login(result.user);
    setShowModal(false);
    navigate("/dashboard");
  }

  // --- Login Anónimo ---
  // async function handleAnonLogin() {
  //   const result = await loginAnonimo();
  //   if (!result.success) {
  //     setMessage(`❌ Error: ${result.message}`);
  //     return;
  //   }

  //   login(result.user);
  //   setShowModal(false);
  //   navigate("/dashboard");
  // }

  return (
    <div className="home-container">
      {/* Header con navegación */}
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
          <h1>Gestión de campo <span className="gold-text">excepcional</span></h1>
          <p>La plataforma premium para profesionales que exigen lo mejor en gestión de proyectos en campo.</p>
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
          <h2>Características <span className="gold-text">Exclusivas</span></h2>
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

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="section-header">
          <div className="gold-accent-line center"></div>
          <h2>Opiniones de <span className="gold-text">Clientes</span></h2>
        </div>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="stars">★★★★★</div>
              <p>"FieldSmart transformó completamente nuestra gestión de proyectos. La elegancia y funcionalidad son incomparables."</p>
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
              <p>"La interfaz es tan intuitiva como poderosa. Hemos reducido nuestro tiempo de gestión en un 40% desde que implementamos FieldSmart."</p>
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

      {/* Modal de Login y Registro  */}
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
                  <p>{isRegister ? "Regístrate para comenzar" : "Ingresa a tu cuenta para continuar"}</p>
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
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label>Contraseña</label>
                    <span className="input-border"></span>
                  </div>

                  {message && (
                    <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
                      {message}
                    </div>
                  )}

                  <button type="submit" className="submit-btn">
                    <span>{isRegister ? "Registrarse" : "Iniciar Sesión"}</span>
                    <div className="btn-shine"></div>
                  </button>
                </form>

                <div className="modal-footer">
                  <p>
                    {isRegister ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}
                    <span onClick={() => {
                      setIsRegister(!isRegister);
                      setMessage("");
                    }}>
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