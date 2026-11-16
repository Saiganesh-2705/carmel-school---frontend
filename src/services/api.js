import axios from 'axios';
import { clearToken, getToken } from '../utils/token';

// Cleans a mistyped VITE_API_URL (e.g. "VITE_API_URL=https://x.com/", missing https:// or missing /api) so the app never ends up
// calling a broken relative URL. In a production build it falls back to the live Render backend instead of localhost,
// which only exists on your own computer (that is why the site worked for you but not on other phones/PCs).
const RENDER_API = 'https://carmel-school-backend.onrender.com/api';
const cleanUrl = (v) => {
  let u = String(v || '').trim().replace(/^VITE_API_URL\s*=\s*/i, '').replace(/^["']|["']$/g, '').replace(/\/+$/, '');
  if (!u) return '';
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  return /\/api$/i.test(u) ? u : `${u}/api`;
};
export const API_URL = cleanUrl(import.meta.env.VITE_API_URL) || (import.meta.env.PROD ? RENDER_API : 'http://localhost:5000/api');
// 60s timeout: Render's free plan needs up to a minute to wake the server after it has been idle.
const api = axios.create({ baseURL: API_URL, timeout: 60000 });
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
