import axiosClient from './axiosClient';

const getShowcaseProjects = (limit = 20, skip = 0) => 
  axiosClient.get(`/projects/showcase?limit=${limit}&skip=${skip}`);

const submitProject = (data) => axiosClient.post('/projects/submit', data);

const getAllProjects = (limit = 20, skip = 0) => 
  axiosClient.get(`/projects/all?limit=${limit}&skip=${skip}`);

const approveProject = (id) => axiosClient.patch(`/projects/${id}/approve`);
const updateProject = (id, data) => axiosClient.patch(`/projects/${id}`, data);
const deleteProject = (id) => axiosClient.delete(`/projects/${id}`);

export default { 
  getShowcaseProjects, 
  submitProject, 
  getAllProjects, 
  approveProject,
  updateProject,
  deleteProject
};