import axios from 'axios';
import { AUTH_EXPIRED_EVENT, loadSession } from '../utils/authStorage';

// The server address comes from the environment (VITE_API_URL), never hard-coded per deployment
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5148';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach the JWT to every call
api.interceptors.request.use((config) => {
  const session = loadSession();
  if (session) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// Response interceptor: an expired / invalid token -> tell AuthContext to log out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginCall = error.config?.url?.startsWith('/auth/');
    if (error.response?.status === 401 && !isLoginCall) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  },
);

/** Every endpoint function returns only the response body. */
export const unwrap = (request) => request.then((response) => response.data);
