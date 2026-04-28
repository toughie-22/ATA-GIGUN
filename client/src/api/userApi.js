import API from './axios';

export const followUser = async (userId) => {
  const { data } = await API.post(`/users/${userId}/follow`);
  return data;
};

export const getNotifications = async () => {
  const { data } = await API.get('/users/notifications');
  return data;
};

export const markNotificationsRead = async () => {
  const { data } = await API.put('/users/notifications/read');
  return data;
};
