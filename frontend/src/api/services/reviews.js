import api from '../axios';

export const getMovieReviews = async (movieId) => {
    const response = await api.get(`/reviews/${movieId}`);
    return response.data;
};

export const createReview = async (movieId, reviewData) => {
    const response = await api.post(`/reviews/${movieId}`, reviewData);
    return response.data;
};

export const updateReview = async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
};

export const deleteReview = async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
};
