import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/videos';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: token ? `Bearer ${token}` : '' };
};

export const fetchAllVideos = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const fetchRecommendedVideos = async () => {
  // Llamamos al endpoint de recomendaciones inteligentes
  const token = localStorage.getItem('token');
  const url = 'http://localhost:5000/api/intelligent/recommendations';

  if (!token) return fetchAllVideos();

  const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
  return res.data.recommendations;
};

export const uploadVideo = async (formData) => {
  const res = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...getAuthHeaders(),
    },
  });
  return res.data;
};

export const getVideoById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const saveMoment = async (videoId, second) => {
  const res = await axios.post(`${API_URL}/${videoId}/moment`, { second }, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
