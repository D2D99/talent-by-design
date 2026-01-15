// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   withCredentials: true, // IMPORTANT for cookies / refresh tokens
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login"; // Force redirect on expiry
    }
    return Promise.reject(error);
  }
);

export default api;