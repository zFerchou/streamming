// src/api/youtube.js
import axios from "axios";

const API_KEY = "AIzaSyCVDLhO9aRzpUCwYhn0c5Ajy6Tzi3ReOa0"; // ← Cámbiala por tu clave real

export default axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    part: "snippet",
    maxResults: 12,
    key: API_KEY,
  },
});
