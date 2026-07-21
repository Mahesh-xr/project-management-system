import axios from 'axios';

// Create a centralized Axios HTTP client instance
const axiosClient = axios.create({
  baseURL: 'https://project-management-system-1u4l.onrender.com/api', // Points to Express backend server
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor:
// Before sending any request to the backend, retrieve the stored JWT token
// from localStorage and attach it to the Authorization header as a Bearer token.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;
