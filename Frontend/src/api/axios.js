// import axios from 'axios';

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
// });

// // Add token to requests
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default API;

import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://casemadad-backend.onrender.com/api',  // ✅ CORRECT
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
