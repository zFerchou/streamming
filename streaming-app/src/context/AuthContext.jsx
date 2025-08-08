import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Configura el token en los headers de axios por defecto
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const data = await authService.obtenerUsuarioActual();
      setUser(data);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err.response?.data?.message || 'Error al obtener usuario');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const { token, user } = await authService.login(credentials);
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout,
      refetchUser: fetchUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};