// This variable lives only as long as the page is open.
// A refresh wipes it out.
let memoryToken = null;

export const setToken = (token) => {
  memoryToken = token;
};

export const getToken = () => {
  return memoryToken;
};

export const clearToken = () => {
  memoryToken = null;
};