import axiosClient from './axiosClient';

const getInsights = (limit = 20, skip = 0) => 
  axiosClient.get(`/insights/?limit=${limit}&skip=${skip}`);

const createInsight = (data) => axiosClient.post('/insights/', data);
const updateInsight = (id, data) => axiosClient.patch(`/insights/${id}`, data);
const deleteInsight = (id) => axiosClient.delete(`/insights/${id}`);

export default {
  getInsights,
  createInsight,
  updateInsight,
  deleteInsight
};