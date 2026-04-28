import API from './axios';

export const getReviews = async (movieId) => {
  const { data } = await API.get(`/reviews/${movieId}`);
  return data;
};

export const createReview = async (reviewData) => {
  const { data } = await API.post('/reviews', reviewData);
  return data;
};

export const deleteReview = async (id) => {
  const { data } = await API.delete(`/reviews/${id}`);
  return data;
};

export const likeReview = async (id) => {
  const { data } = await API.post(`/reviews/${id}/like`);
  return data;
};

export const dislikeReview = async (id) => {
  const { data } = await API.post(`/reviews/${id}/dislike`);
  return data;
};
