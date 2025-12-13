// ✅ FIX 1: Match the filename exactly (axiosclient.js -> ./axiosclient)
import axiosClient from './axiosClient'; 
import { setToken, clearToken, getToken } from './tokenStore';

const authService = {
  login: async (username, password) => {
    // 1. Prepare Form Data
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    // 2. Make the call
    // ⚠️ IMPORTANT: Check your Swagger UI. 
    // If the POST route is listed as "/auth/token", change the line below to '/auth/token'
    const response = await axiosClient.post('/auth/login', params, {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      // This ensures we don't send an old/invalid token header during login
      transformRequest: [(data, headers) => {
        delete headers['Authorization']; 
        return data; 
      }]
    });

    if (response.data.access_token) {
      setToken(response.data.access_token);
    }
    return response.data;
  },

  register: async (userData) => {
    // Registration usually accepts JSON, so no special headers needed
    return axiosClient.post('/auth/register', userData);
  },

  logout: () => {
    clearToken();
  },

  isAuthenticated: () => {
    return !!getToken();
  },

  requestPasswordReset: (username) => {
    // Using query param for GET-style data in a POST
    return axiosClient.post(`/auth/request-reset?username=${username}`);
  },

  getResetRequests: () => {
    return axiosClient.get('/auth/reset-requests');
  },

  adminResetPassword: (userId, newPassword) => {
    return axiosClient.post('/auth/approve-reset', { 
      user_id: userId, 
      new_password: newPassword 
    });
  }
};

export default authService;