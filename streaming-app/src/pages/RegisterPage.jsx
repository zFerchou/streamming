import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowLeft } from "lucide-react";
import { authService } from "../services/authService";
import "../styles/global.css"; // Importamos los estilos

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="login-card"
      >
        {/* Botón de regreso */}
        <button 
          onClick={() => navigate(-1)}
          className="back-button"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span className="text-sm">Atrás</span>
        </button>
        
        <h2 className="login-title">Crear Cuenta</h2>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="error-message"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Username */}
          <div className="input-group">
            <label className="input-label">Nombre de usuario</label>
            <div className="input-container">
              <User className="input-icon" />
              <input
                type="text"
                placeholder="Ingrese su nombre de usuario"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="text-input"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label className="input-label">Correo electrónico</label>
            <div className="input-container">
              <Mail className="input-icon" />
              <input
                type="email"
                placeholder="Ingrese su correo electrónico"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="text-input"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label className="input-label">Contraseña</label>
            <div className="input-container">
              <Lock className="input-icon" />
              <input
                type="password"
                placeholder="Ingrese su contraseña"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                minLength="6"
                className="text-input"
                required
              />
            </div>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="login-button"
          >
            Registrarse
          </motion.button>
        </form>

        <div className="separator">
          <div className="separator-line"></div>
          <span className="separator-text">O regístrate usando</span>
          <div className="separator-line"></div>
        </div>
        
        <div className="social-buttons">
          <button className="social-button">
            <span className="social-icon">f</span>
          </button>
          <button className="social-button">
            <span className="social-icon">g</span>
          </button>
          <button className="social-button">
            <span className="social-icon">G</span>
          </button>
        </div>

        <div className="separator">
          <div className="separator-line"></div>
          <span className="separator-text">O regístrate usando</span>
          <div className="separator-line"></div>
        </div>
        
        <div className="alternative-action">
          <Link to="/login" className="alternative-button">
            INICIAR SESIÓN
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default RegisterPage;