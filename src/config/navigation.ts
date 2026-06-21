/**
 * Navigation Configuration
 * Centralized navigation configuration for all roles
 */

export interface NavItem {
  path: string;
  label: string;
}

export interface RoleConfig {
  name: string;
  color: string;
  basePath: string;
  navItems: NavItem[];
}

export interface ColorClasses {
  bg: string;
  hover: string;
  badge: string;
}

export const ROLE_CONFIG: Record<string, RoleConfig> = {
  SUPER_ADMIN: {
    name: 'Super Admin',
    color: 'purple',
    basePath: '/superadmin',
    navItems: [
      { path: '/superadmin/dashboard', label: 'Dashboard' },
      { path: '/superadmin/schools', label: 'Schools' },
      { path: '/superadmin/users', label: 'Users' },
    ],
  },
  PRINCIPAL: {
    name: 'Principal',
    color: 'blue',
    basePath: '/principal',
    navItems: [
      { path: '/principal/dashboard', label: 'Dashboard' },
      { path: '/principal/teachers', label: 'Teachers' },
      { path: '/principal/students', label: 'Students' },
      { path: '/principal/classes', label: 'Classes' },
    ],
  },
  TEACHER: {
    name: 'Teacher',
    color: 'green',
    basePath: '/teacher',
    navItems: [
      { path: '/teacher/dashboard', label: 'Dashboard' },
      { path: '/teacher/classes', label: 'My Classes' },
      { path: '/teacher/attendance', label: 'Attendance' },
      { path: '/teacher/grades', label: 'Grades' },
    ],
  },
  STUDENT: {
    name: 'Student',
    color: 'orange',
    basePath: '/student',
    navItems: [
      { path: '/student/dashboard', label: 'Dashboard' },
      { path: '/student/grades', label: 'My Grades' },
      { path: '/student/attendance', label: 'Attendance' },
      { path: '/student/assignments', label: 'Assignments' },
    ],
  },
  PARENT: {
    name: 'Parent',
    color: 'teal',
    basePath: '/parent',
    navItems: [
      { path: '/parent/dashboard', label: 'Dashboard' },
      { path: '/parent/children', label: 'My Children' },
      { path: '/parent/fees', label: 'Fees' },
    ],
  },
};

/**
 * Get navigation config for a role
 * @param role - Role name
 * @returns Navigation config for the role
 */
export function getNavigationConfig(role: string): RoleConfig | null {
  return ROLE_CONFIG[role] || null;
}

/**
 * Get color class for a role
 * @param color - Color name
 * @returns Tailwind color classes
 */
export function getColorClasses(color: string): ColorClasses {
  const colorMap: Record<string, ColorClasses> = {
    purple: {
      bg: 'bg-purple-600',
      hover: 'hover:bg-purple-700',
      badge: 'bg-purple-800',
    },
    blue: {
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      badge: 'bg-blue-800',
    },
    green: {
      bg: 'bg-green-600',
      hover: 'hover:bg-green-700',
      badge: 'bg-green-800',
    },
    orange: {
      bg: 'bg-orange-600',
      hover: 'hover:bg-orange-700',
      badge: 'bg-orange-800',
    },
    teal: {
      bg: 'bg-teal-600',
      hover: 'hover:bg-teal-700',
      badge: 'bg-teal-800',
    },
  };
  return colorMap[color] || colorMap.blue;
}
