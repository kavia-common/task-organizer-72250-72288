import axios from 'axios';
import { getToken, clearToken } from '../utils/tokenStorage';

/**
 * Axios API client configured for the backend.
 * - Base URL from REACT_APP_API_BASE_URL env (production recommended)
 * - In development, use '/api' and rely on CRA proxy (src/setupProxy.js) to forward to the backend.
 * - Authorization header from persisted token
 * - 401 handling clears token and dispatches a logout event
 */

// Resolve the API base URL:
// 1) Prefer explicit REACT_APP_API_BASE_URL (works in any environment)
// 2) Fallback to '/api' which requires the dev proxy to be configured
const resolvedBaseURL = process.env.REACT_APP_API_BASE_URL || '/api';

// Developer hint if using the fallback without a proxy target set
if (
  resolvedBaseURL === '/api' &&
  typeof window !== 'undefined' &&
  !process.env.REACT_APP_PROXY_TARGET
) {
  // eslint-disable-next-line no-console
  console.warn(
    "[api] Using baseURL '/api'. Ensure src/setupProxy.js has REACT_APP_PROXY_TARGET set to your backend (e.g., https://localhost:3001) " +
      "or set REACT_APP_API_BASE_URL to the backend full URL."
  );
}

const api = axios.create({
  baseURL: resolvedBaseURL,
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
