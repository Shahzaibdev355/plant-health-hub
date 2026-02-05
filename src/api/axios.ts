

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1", // change if needed
  // baseURL: "https://two-factor-authentication-two.vercel.app/api/v1",
  withCredentials: true,
});

// Add request interceptor to include token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    console.log('Axios interceptor - Token found:', !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - clearing token');
      localStorage.removeItem('accessToken');
      // You might want to redirect to login here
    }
    return Promise.reject(error);
  }
);

export default api;

