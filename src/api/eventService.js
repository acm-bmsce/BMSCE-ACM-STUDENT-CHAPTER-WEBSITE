import axiosClient from './axiosClient';

// ✅ UPDATE: Accept limit and skip arguments
const getEvents = (limit = 20, skip = 0) => {
  return axiosClient.get(`/events/?limit=${limit}&skip=${skip}`);
};

const createEvent = (data) => axiosClient.post('/events/', data);
const updateEvent = (id, data) => axiosClient.patch(`/events/${id}`, data);
const deleteEvent = (id) => axiosClient.delete(`/events/${id}`);

export default { getEvents, createEvent, updateEvent, deleteEvent };