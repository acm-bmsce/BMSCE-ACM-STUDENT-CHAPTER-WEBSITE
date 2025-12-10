import axiosClient from './axiosClient';
import { setToken, clearToken, getToken } from './tokenStore';

const login = async (username, password) => {
  // FastAPI OAuth2 expects form-data, not JSON
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await axiosClient.post('/auth/login', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  if (response.data.access_token) {
    // SAVE TO MEMORY ONLY
    setToken(response.data.access_token);
  }
  return response.data;
};

const logout = () => {
  clearToken();
};

const isAuthenticated = () => {
  // Check if we have a token in memory
  return !!getToken();
};

const requestPasswordReset = (username) => {
  // Use params for simple query string
  return axiosClient.post(`/auth/request-reset?username=${username}`);
};

const getResetRequests = () => axiosClient.get('/auth/reset-requests');

const adminResetPassword = (userId, newPassword) => {
  return axiosClient.post('/auth/approve-reset', { 
    user_id: userId, 
    new_password: newPassword 
  });
};

const register = (userData) => {
  return axiosClient.post('/auth/register', userData);
};

export default {
  login,
  logout,
  register,
  isAuthenticated,
  requestPasswordReset, // Export these
  getResetRequests,
  adminResetPassword
};