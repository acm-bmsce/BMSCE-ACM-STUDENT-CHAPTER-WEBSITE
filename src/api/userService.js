import axiosClient from './axiosClient';

// Get list of users waiting for approval
const getPendingUsers = () => axiosClient.get('/auth/pending');

// Approve a specific user
const approveUser = (userId) => axiosClient.patch(`/auth/${userId}/approve`);

export default {
  getPendingUsers,
  approveUser
};