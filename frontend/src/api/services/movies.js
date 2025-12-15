import api from '../axios';

export const getMovies = async (params) => {
    const response = await api.get('/movies/', { params });
    return response.data;
};

export const getMovie = async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
};

export const createMovie = async (movieData) => {
    const response = await api.post('/movies/', movieData);
    return response.data;
};

export const updateMovie = async (id, movieData) => {
    const response = await api.put(`/movies/${id}`, movieData);
    return response.data;
};

export const deleteMovie = async (id) => {
    const response = await api.delete(`/movies/${id}`);
    return response.data;
};
