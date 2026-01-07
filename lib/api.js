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
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
          const response = await api.post('/auth/refresh-token', { refreshToken });
          const { accessToken } = response.data;
          Cookies.set('accessToken', accessToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Handle refresh token failure (e.g., redirect to login)
        console.error('Token refresh failed:', refreshError);
        // You might want to redirect to login or clear cookies here
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
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
};

export const excelApi = {
  download: (params) => api.get('/excel/download', { params, responseType: 'blob' }),
};

export default api;
