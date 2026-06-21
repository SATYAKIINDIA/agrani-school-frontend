/**
 * Permission Constants
 * Format: resource:action
 * Examples: students:read, students:write, grades:read, grades:write
 */

// Student permissions
export const STUDENT_READ = 'students:read';
export const STUDENT_WRITE = 'students:write';
export const STUDENT_DELETE = 'students:delete';

// Teacher permissions
export const TEACHER_READ = 'teachers:read';
export const TEACHER_WRITE = 'teachers:write';
export const TEACHER_DELETE = 'teachers:delete';

// Grade permissions
export const GRADE_READ = 'grades:read';
export const GRADE_WRITE = 'grades:write';
export const GRADE_DELETE = 'grades:delete';

// Class permissions
export const CLASS_READ = 'classes:read';
export const CLASS_WRITE = 'classes:write';
export const CLASS_DELETE = 'classes:delete';

// Attendance permissions
export const ATTENDANCE_READ = 'attendance:read';
export const ATTENDANCE_WRITE = 'attendance:write';

// Assignment permissions
export const ASSIGNMENT_READ = 'assignments:read';
export const ASSIGNMENT_WRITE = 'assignments:write';
export const ASSIGNMENT_DELETE = 'assignments:delete';

// Fee permissions
export const FEE_READ = 'fees:read';
export const FEE_WRITE = 'fees:write';

// Library permissions
export const LIBRARY_READ = 'library:read';
export const LIBRARY_WRITE = 'library:write';

// User management permissions
export const USER_READ = 'users:read';
export const USER_WRITE = 'users:write';
export const USER_DELETE = 'users:delete';

// School/Tenant management permissions
export const SCHOOL_READ = 'schools:read';
export const SCHOOL_WRITE = 'schools:write';
export const SCHOOL_DELETE = 'schools:delete';

// Profile permissions
export const PROFILE_READ = 'profile:read';
export const PROFILE_WRITE = 'profile:write';

// Report permissions
export const REPORT_READ = 'reports:read';
export const REPORT_WRITE = 'reports:write';

// System permissions (for super admin)
export const SYSTEM_ADMIN = 'system:admin';
export const SYSTEM_CONFIG = 'system:config';

// Wildcard permission (all permissions)
export const ALL_PERMISSIONS = '*';
