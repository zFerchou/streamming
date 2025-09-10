import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { authService } from '../services/authService';
import useAuth from '../hooks/useAuth';
import '../styles/global.css'; // Importamos los estilos

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { user } = await authService.login({ email, password });
      setUser(user);
      navigate('/');
    } catch (error) {
      setError(error.message);
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
        
        <h2 className="login-title">Iniciar Sesión</h2>

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
          {/* Email */}
          <div className="input-group">
            <label className="input-label">Correo electrónico</label>
            <div className="input-container">
              <Mail className="input-icon" />
              <input
                type="email"
                placeholder="Ingrese su correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="text-input"
                required
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="forgot-password">
            <a href="#forgot" className="forgot-link">¿Olvidaste tu contraseña?</a>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="login-button"
          >
            INICIAR SESIÓN
          </motion.button>
        </form>

        <div className="separator">
          <div className="separator-line"></div>
          <span className="separator-text">O inicia sesión usando</span>
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
          <Link to="/register" className="alternative-button">
            REGISTRARSE
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;