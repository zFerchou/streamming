// src/services/livestreamService.js
import api from './api'; // Asegúrate de tener un archivo api.js que exporte la instancia axios configurada

const URL_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
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
