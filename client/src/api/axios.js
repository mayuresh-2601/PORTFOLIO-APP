import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const csrfToken = sessionStorage.getItem("csrfToken");

    config.headers = config.headers || {};

    if (csrfToken && !["get", "head", "options"].includes(config.method)) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("csrfToken");

      if (window.location.pathname.startsWith("/admin/dashboard")) {
        window.location.replace("/admin");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
