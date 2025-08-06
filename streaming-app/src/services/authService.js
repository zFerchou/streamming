import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

export const register = async (data) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

export const login = async (data) => {
  const res = await axios.post(`${API_URL}/login`, data);
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
  }
  return res.data;
};

export const getUserFromToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const res = await axios.get(`${API_URL.replace('/auth', '/users')}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch {
    localStorage.removeItem('token');
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};
