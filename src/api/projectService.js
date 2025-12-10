import axiosClient from './axiosClient';

// Matches backend: GET /projects/?limit=9&skip=0
const getAllProjects = (limit = 9, skip = 0) => {
  return axiosClient.get(`/projects/?limit=${limit}&skip=${skip}`);
};

// Matches backend: GET /projects/showcase
const getShowcaseProjects = (limit = 50) => {
  return axiosClient.get(`/projects/showcase?limit=${limit}`);
};

// Matches backend: POST /projects/
// Your component calls this "submitProject"
const submitProject = (data) => {
  return axiosClient.post('/projects/', data);
};

// Matches backend: PATCH /projects/{id}
const updateProject = (id, data) => {
  return axiosClient.patch(`/projects/${id}`, data);
};

// Matches backend: PATCH /projects/{id} (sending just the status update)
const approveProject = (id) => {
  return axiosClient.patch(`/projects/${id}/approve`, { status: 'APPROVED' });
};

// Matches backend: DELETE /projects/{id}
const deleteProject = (id) => {
  return axiosClient.delete(`/projects/${id}`);
};

export default {
  getAllProjects,
  getShowcaseProjects,
  submitProject,
  updateProject,
  approveProject,
  deleteProject
};