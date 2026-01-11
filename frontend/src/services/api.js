import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
};

// Flights API
export const flightsAPI = {
    getAll: () => api.get('/flights'),
    getById: (id) => api.get(`/flights/${id}`),
    create: (flightData) => api.post('/flights', flightData),
    update: (id, flightData) => api.put(`/flights/${id}`, flightData),
    delete: (id) => api.delete(`/flights/${id}`),
};

// Upload API
export const uploadAPI = {
    uploadPhoto: (formData) => api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};

// Airport API
export const airportAPI = {
    getAll: () => api.get('/airports'),
    search: (query) => api.get(`/airports/search?query=${query}`),
    getByCode: (code) => api.get(`/airports/${code}`),
    getBatch: (codes) => api.post('/airports/batch', { codes }),
};

export default api;
