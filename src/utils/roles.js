export const ROLE_LABELS = {
  super_admin: 'Super Admin', admin: 'Principal / Admin', teacher: 'Teacher', student: 'Student',
  parent: 'Parent', accountant: 'Accountant', librarian: 'Librarian',
};
export const ROLE_HOME = {
  super_admin: '/admin', admin: '/admin', teacher: '/teacher', student: '/student',
  parent: '/parent', accountant: '/accountant', librarian: '/librarian',
};
export const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
