import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // IMPORTANT for cookies / refresh tokens
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
