import axios from 'axios';

const API = axios.create({
  // Agar production (Render) par hai toh wo wali URL, warna localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/todos'
});

export default API;