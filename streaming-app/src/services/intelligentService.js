import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/intelligent';



const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: token ? `Bearer ${token}` : '' };
};

export const getRecommendations = async () => {
  const res = await axios.get(`${API_URL}/recommendations`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
