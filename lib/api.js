import axios from "axios";
import Cookies from "js-cookie";

/* ===== Base URL ===== */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/* ===== Axios Instance ===== */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/* ===== Token Refresh State ===== */
let isRefreshing = false;
let refreshSubscribers = [];
let logoutInProgress = false;

/* ===== Helper Functions ===== */
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
    await api.post("/auth/logout");
  } catch {
    // ignore logout failure
  }

  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  Cookies.remove("emailId");

  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}

/* ===== Request Interceptor ===== */
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ===== Response Interceptor ===== */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || "";

    // Skip refresh for refresh-token API itself
    if (url.includes("/auth/refresh-token")) {
      await forceLogout();
      return Promise.reject(error);
    }

    // Handle token expiration
    if (
      status &&
      [401, 403].includes(status) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        await forceLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await api.post("/auth/refresh-token", {
          refreshToken,
        });

        const newAccessToken = res.data?.accessToken;
        if (!newAccessToken) throw new Error("No access token in refresh");

        Cookies.set("accessToken", newAccessToken);
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

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

/* ===== Auth APIs ===== */
export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  refreshToken: (token) =>
    api.post("/auth/refresh-token", { refreshToken: token }),
  logout: () => api.post("/auth/logout"),
  forgotPassword: (emailId) =>
    api.post(`/auth/forgot-password/${emailId}`),
  verifyOtp: (data) => api.post("/auth/verify-otp", data),
  resendOtp: (emailId) =>
    api.post(`/auth/resend-otp/${emailId}`),
  resetPassword: (data) =>
    api.post("/auth/reset-password", data),
  changePassword: (data) =>
    api.post("/auth/change-password", data),
};

/* ===== User APIs ===== */
export const userApi = {
  getProfile: (emailId) =>
    api.get(`/users/profile/${emailId}`),
  updateProfile: (data) =>
    api.put("/users/profile", data),
};

/* ===== Student APIs ===== */
export const studentApi = {
  getStudents: (params) =>
    api.get("/students/retrive", { params }),

  createStudent: (data) =>
    api.post("/students/create", data, {
      headers: { Authorization: undefined },
    }),

  getStates: () => api.get("/students/states"),
  getYearsOfExperience: () =>
    api.get("/students/yearsOfExperience"),
  getExperienceLevels: () =>
    api.get("/students/experienceLevel"),
  deleteStudent: (id) =>
    api.delete(`/students/delete/${id}`),
};

/* ===== Excel APIs ===== */
export const excelApi = {
  download: (params) =>
    api.get("/excel/download", {
      params,
      responseType: "blob",
    }),
};

export default api;
