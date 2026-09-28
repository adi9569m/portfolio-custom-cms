import axios from "axios";

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request Interceptor: Attach JWT Access Token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cms_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle expired tokens or unauthorized errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and not already retried
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("cms_refresh_token");

      if (refreshToken) {
        try {
          // Attempt to refresh the access token
          const res = await axios.post(
            `${API_BASE_URL}/api/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`
              }
            }
          );

          const newAccessToken = res.data.access_token;
          localStorage.setItem("cms_access_token", newAccessToken);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshErr) {
          // If refresh token fails, wipe credentials and redirect to login
          localStorage.removeItem("cms_access_token");
          localStorage.removeItem("cms_refresh_token");
          localStorage.removeItem("cms_user");
          window.location.href = "/login";
        }
      } else {
        localStorage.removeItem("cms_access_token");
        localStorage.removeItem("cms_user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
