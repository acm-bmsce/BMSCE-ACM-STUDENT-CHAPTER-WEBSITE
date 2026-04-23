import axiosClient from './axiosClient';

const getEvents = (limit = 20, skip = 0, featured = null) => {
  let url = `/events/?limit=${limit}&skip=${skip}`;
  if (featured !== null) {
    url += `&featured=${featured}`;
  }
  return axiosClient.get(url);
};

const createEvent = (data) => axiosClient.post('/events/', data);
const updateEvent = (id, data) => axiosClient.patch(`/events/${id}`, data);
const deleteEvent = (id) => axiosClient.delete(`/events/${id}`);
const registerForEvent = (eventId, data) => axiosClient.post(`/events/${eventId}/register`, data);

// ✅ NEW: Add this line to fetch the registrations
const getEventRegistrations = (eventId) => axiosClient.get(`/events/${eventId}/registrations`);

// Add this line:
const getEvent = (id) => axiosClient.get(`/events/${id}`);

// And add it to your exports:
export default { getEvents, getEvent, createEvent, updateEvent, deleteEvent, registerForEvent, getEventRegistrations };