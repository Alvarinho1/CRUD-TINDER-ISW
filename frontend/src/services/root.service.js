// root.service.js
import axios from 'axios';
import cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = cookies.get('jwt-auth', { path: '/' }); // Obtener el token de la cookie correcta
    if (token && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      cookies.remove('jwt-auth', { path: '/' });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
