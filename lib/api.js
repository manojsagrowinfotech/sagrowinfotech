import axios from 'axios';
import Cookies from 'js-cookie';

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// In-memory access token (IMPORTANT)
let accessToken = null;
let isRefreshing = false;
let logoutInProgress = false;
let refreshSubscribers = [];

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 🔥 REQUIRED for cookies
});

/* ===========================
   Helper functions
=========================== */

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

async function forceLogout() {
  if (logoutInProgress) return;
  logoutInProgress = true;

  try {
    await api.post('/auth/logout');
  } catch (e) {
    // ignore
  }

  accessToken = null;
  Cookies.remove('emailId');

  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

/* ===========================
   Request Interceptor
=========================== */
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ===========================
   Response Interceptor
=========================== */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // If unauthorized, try refresh ONCE
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue requests while refreshing
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await api.post('/auth/refresh-token');
        const newAccessToken = res.data?.accessToken;

        if (!newAccessToken) throw new Error('No access token');

        accessToken = newAccessToken;
        isRefreshing = false;
        onRefreshed(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        await forceLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/* ===========================
   API Methods
=========================== */

export const authApi = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    accessToken = res.data?.accessToken;
    return res;
  },
  logout: async () => {
    await forceLogout();
  },
};

export const userApi = {
  getProfile: (emailId) => api.get(`/users/profile/${emailId}`),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const studentApi = {
  getStudents: (params) => api.get('/students/retrive', { params }),
  createStudent: (data) => api.post('/students/create', data),
  getStates: () => api.get('/students/states'),
  getYearsOfExperience: () => api.get('/students/yearsOfExperience'),
  getExperienceLevels: () => api.get('/students/experienceLevel'),
  deleteStudent: (id) => api.delete(`/students/delete/${id}`),
};

export const excelApi = {
  download: (params) =>
    api.get('/excel/download', { params, responseType: 'blob' }),
};

export default api;
