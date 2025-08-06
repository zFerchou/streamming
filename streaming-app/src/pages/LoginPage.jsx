import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { user } = await login({ email, password });
      setUser(user);
      navigate('/');
    } catch {
      alert('Error en login');
    }
  };

  return (
    <div className="login-page">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default LoginPage;
