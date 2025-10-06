import axios from "axios";

// Prefer env override, fallback to live backend URL
const API_BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // if you're using cookies or auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add token automatically if stored in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;