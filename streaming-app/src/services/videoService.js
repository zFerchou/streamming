import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const VIDEOS_URL = `${BASE_URL}/videos`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: token ? `Bearer ${token}` : '' };
};

export const fetchAllVideos = async () => {
  try {
    const res = await axios.get(`${VIDEOS_URL}/`);
    return res.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};



export const uploadVideo = async (formData) => {
  try {
    const res = await axios.post(`${VIDEOS_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeaders(),
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

export const getVideoById = async (id) => {
  try {
    const res = await axios.get(`${VIDEOS_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching video by ID:', error);
    throw error;
  }
};

export const saveMoment = async (videoId, second) => {
  try {
    const res = await axios.post(`${VIDEOS_URL}/${videoId}/moment`, { second }, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error('Error saving moment:', error);
    throw error;
  }
};
export const fetchRecommendedVideos = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    
    const res = await axios.get(`${VIDEOS_URL}/recommendations`, config);
    return res.data?.recommendations || [];
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};