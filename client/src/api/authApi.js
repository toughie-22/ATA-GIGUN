import API from './axios';

export const loginUser = async (credentials) => {
  const { data } = await API.post('/auth/login', credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await API.post('/auth/register', userData);
  return data;
};

export const getMe = async () => {
  const { data } = await API.get('/auth/me');
  return data;
};
