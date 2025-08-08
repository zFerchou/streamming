import axios from 'axios';

const URL_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const URL_AUTH = `${URL_BASE}/auth`;
const URL_USUARIOS = `${URL_BASE}/users`;
const URL_PREFERENCIAS = `${URL_BASE}/preferences`;

// Configuración de axios
const api = axios.create({
  baseURL: URL_BASE,
  timeout: 10000, // 10 segundos de espera
});

// Interceptor para añadir token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) { // No autorizado
      localStorage.removeItem('token');
      window.location.reload(); // Recargar para limpiar estado
    }
    return Promise.reject(error);
  }
);

export const authService = {
  registrar: async (datos) => {
    try {
      const respuesta = await api.post(`${URL_AUTH}/register`, datos);
      return respuesta.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el registro');
    }
  },

  login: async (datos) => {
    try {
      const respuesta = await api.post(`${URL_AUTH}/login`, datos);
      if (respuesta.data.token) {
        localStorage.setItem('token', respuesta.data.token);
      }
      return respuesta.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el login');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },

  obtenerUsuarioActual: async () => {
    try {
      const respuesta = await api.get(`${URL_USUARIOS}/me`);
      return respuesta.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      return null;
    }
  }
};

export const preferencesService = {
  actualizarPreferencias: async (preferencias) => {
    try {
      const respuesta = await api.put(`${URL_PREFERENCIAS}`, preferencias);
      return respuesta.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar preferencias');
    }
  },

  obtenerPreferencias: async () => {
    try {
      const respuesta = await api.get(`${URL_PREFERENCIAS}`);
      return respuesta.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener preferencias');
    }
  },

  obtenerHashtagsDisponibles: async () => {
    try {
      const respuesta = await api.get(`${URL_PREFERENCIAS}/hashtags`);
      return respuesta.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener hashtags');
    }
  }
};

export const userService = {
  actualizarPerfil: async (formData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${URL_USUARIOS}/me`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        // ¡NO incluir Content-Type manualmente!
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 
      `Error ${error.response?.status}: ${error.response?.data?.error}`);
  }
},

  subirAvatar: async (archivo) => {
    const formData = new FormData();
    formData.append('avatar', archivo);
    
    try {
      const respuesta = await api.post(`${URL_USUARIOS}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return respuesta.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al subir avatar');
    }
  }
};


// Función para limpiar autenticación
export const limpiarAuth = () => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};

