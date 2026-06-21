/**
 * Role Constants
 * Available user roles in the system
 */

export const ROLES = [
  { value: 'STUDENT', label: 'Student' },
  { value: 'TEACHER', label: 'Teacher' },
  { value: 'PRINCIPAL', label: 'Principal' },
  { value: 'PARENT', label: 'Parent' },
];

export const SUPER_ADMIN_ROLE = 'SUPER_ADMIN';

// Role to dashboard path mapping
export const ROLE_DASHBOARD_PATHS = {
  STUDENT: '/student/dashboard',
  TEACHER: '/teacher/dashboard',
  PRINCIPAL: '/principal/dashboard',
  PARENT: '/parent/dashboard',
  SUPER_ADMIN: '/superadmin/dashboard',
};
