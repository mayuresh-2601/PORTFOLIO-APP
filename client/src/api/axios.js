import axios from "axios";


// API Base URL

const API_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");


// Axios Instance

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000, // 30 seconds
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});


// Request Interceptor

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let the browser automatically set multipart/form-data headers
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// Response Interceptor

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname.startsWith("/admin")) {
        window.location.replace("/admin");
      }
    }

    return Promise.reject(error);
  }
);

export default api;