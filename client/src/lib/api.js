import axios from "axios";

// ✅ Use your live backend URL
const API_BASE_URL = "https://cafeteria-backend-ky8l.onrender.com";

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
