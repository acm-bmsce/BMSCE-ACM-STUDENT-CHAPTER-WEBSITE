import axios from 'axios';
import { getToken, clearToken } from './tokenStore';

const axiosClient = axios.create({
  // ✅ DYNAMIC URL: Uses Cloudflare variable in prod, localhost in dev
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR
axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearToken();
      // Optional: window.location.href = '/admin/login'; 
    }
    return Promise.reject(error);
  }
);

export default axiosClient;