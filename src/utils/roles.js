import { API_URL } from '../services/api';
export const ROLE_LABELS = {
  super_admin: 'Super Admin', admin: 'Principal / Admin', teacher: 'Teacher', student: 'Student',
  parent: 'Parent', accountant: 'Accountant', librarian: 'Librarian',
};
export const ROLE_HOME = {
  super_admin: '/admin', admin: '/admin', teacher: '/teacher', student: '/student',
  parent: '/parent', accountant: '/accountant', librarian: '/librarian',
};
export const API_ORIGIN = API_URL.replace(/\/api$/, '');
