import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        return null;
      }
    }
    return null;
  },
};

// Farmer APIs
export const farmerAPI = {
  getAll: () => api.get('/farmers'),
  getById: (id) => api.get(`/farmers/${id}`),

  create: (formData) =>
    api.post('/farmers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id, formData) => {
    formData.append('_method', 'POST');
    return api.post(`/farmers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete: (id) => api.delete(`/farmers/${id}`),
};


// Admin APIs
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getAllFarmers: () => api.get('/admin/farmers'),
};

export default api;