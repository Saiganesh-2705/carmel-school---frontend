import { API_URL } from '../services/api';
// The portal has one role: Admin. The admin can do everything.
export const ROLE_LABELS = { admin: 'Admin' };
export const ROLE_HOME = { admin: '/admin' };
export const API_ORIGIN = API_URL.replace(/\/api$/, '');
