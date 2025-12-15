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

export default { getEvents, createEvent, updateEvent, deleteEvent };