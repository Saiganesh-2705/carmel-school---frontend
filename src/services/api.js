import axios from 'axios';
import { clearToken, getToken } from '../utils/token';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_URL, timeout: 20000 });
const PORTAL = /^\/(admin|teacher|student|parent|accountant|librarian)(\/|$)/;

api.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
api.interceptors.response.use((r) => r, (err) => {
  const isLogin = err.config?.url?.startsWith('/auth/login');
  // An expired session only bounces you to /login when you are inside the portal, never from the public website.
  if (err.response?.status === 401 && !isLogin) {
    clearToken();
    if (PORTAL.test(location.pathname)) location.assign('/login');
  }
  return Promise.reject(err);
});
export const errMsg = (e) => {
  if (!e.response) return `Cannot reach the server (${API_URL}). Make sure the backend is running and CLIENT_URL allows this site.`;
  return e.response.data?.errors?.[0]?.message || e.response.data?.message || 'Something went wrong. Please try again';
};
export default api;
