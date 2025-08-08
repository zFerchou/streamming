import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const INTELLIGENT_URL = `${BASE_URL}/intelligent`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: token ? `Bearer ${token}` : '' };
};

export const getRecommendations = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return [];
    
    const res = await axios.get(`${INTELLIGENT_URL}/recommendations`, {
      headers: getAuthHeaders()
    });
    return res.data.recommendations || [];
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
};