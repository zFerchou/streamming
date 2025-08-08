import axios from "axios";

export const API_KEY = "AIzaSyC0oSV_GT_32NLCE22UZSAV4sQbtdfVxTE"; // ← Recuerda proteger esta clave

const youtube = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    part: 'snippet',
    maxResults: 12,
    key: process.env.REACT_APP_YOUTUBE_API_KEY, // Usa variables de entorno
    type: 'video'
  }
});

export default youtube;