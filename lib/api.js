import axios from 'axios';
import Cookies from 'js-cookie';

// Define the base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || '';
    // If access token expired on any request, try refresh once
    if (status && [401, 403].includes(status) && !originalRequest?._retry && !url.includes('/auth/refresh-token')) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
          const response = await api.post('/auth/refresh-token', { refreshToken });
          const { accessToken } = response.data || {};
          if (accessToken) {
            Cookies.set('accessToken', accessToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
          throw new Error('No accessToken in refresh response');
        }
      } catch (refreshError) {
        // Handle refresh failure: force logout
        try { await api.post('/auth/logout'); } catch {}
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('emailId');
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
    }
    // If the failing request is the refresh-token endpoint itself, logout immediately
    if (url.includes('/auth/refresh-token')) {
      try { await api.post('/auth/logout'); } catch {}
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('emailId');
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  refreshToken: (token) => api.post('/auth/refresh-token', { refreshToken: token }),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (emailId) => api.post(`/auth/forgot-password/${emailId}`),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const userApi = {
  getProfile: (emailId) => api.get(`/users/profile/${emailId}`),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const studentApi = {
  getStudents: (params) => api.get('/students/retrive', { params }),
  createStudent: (data) => api.post('/students/create', data, { headers: { Authorization: undefined } }),
  getStates: () => api.get('/students/states'),
  getYearsOfExperience: () => api.get('/students/yearsOfExperience'),
  getExperienceLevels: () => api.get('/students/experienceLevel'),
};

export const excelApi = {
  download: (params) => api.get('/excel/download', { params, responseType: 'blob' }),
};

export default api;
