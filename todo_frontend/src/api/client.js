import axios from 'axios';
import { getToken, clearToken } from '../utils/tokenStorage';

/**
 * Axios API client configured for the backend.
 * - Base URL from REACT_APP_API_BASE_URL env
 * - Authorization header from persisted token
 * - 401 handling clears token and dispatches a logout event
 */

// Create instance with base URL from env var
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT if present
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // Attach bearer token
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch 401s and trigger global logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear token and broadcast logout event for the app
      clearToken();
      window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'unauthorized' } }));
    }
    return Promise.reject(error);
  }
);

export default api;
