import axios from 'axios';

const URL_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const URL_AUTH = `${URL_BASE}/auth`;
const URL_USUARIOS = `${URL_BASE}/users`;

const api = axios.create({
  baseURL: URL_BASE,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post(`${URL_AUTH}/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el login');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    return Promise.resolve();
  },

  register: async (userData) => {
    try {
      const response = await api.post(`${URL_AUTH}/register`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el registro');
    }
  },

  obtenerUsuarioActual: async () => {
    try {
      const response = await api.get(`${URL_USUARIOS}/me`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuario actual');
    }
  }
};

export const userService = {
  obtenerPerfil: async () => {
    try {
      const response = await api.get(`${URL_USUARIOS}/me`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener perfil');
    }
  },

  actualizarPerfil: async (formData) => {
    try {
      const response = await api.put(`${URL_USUARIOS}/me`, formData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar perfil');
    }
  },

  subirAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    try {
      const response = await api.post(`${URL_USUARIOS}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al subir avatar');
    }
  }
};

const URL_LIVESTREAMS = `${URL_BASE}/livestreams`;

export const livestreamService = {
  start: async ({ userId, username }) => {
    try {
      const response = await api.post(`${URL_LIVESTREAMS}/start`, { userId, username });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al iniciar transmisión');
    }
  },

  stop: async (userId) => {
    try {
      const response = await api.post(`${URL_LIVESTREAMS}/stop`, { userId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al detener transmisión');
    }
  },

  getActiveStreams: async () => {
    try {
      const response = await api.get(`${URL_LIVESTREAMS}/active`);
      return response.data.streams;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener transmisiones activas');
    }
  }
};
