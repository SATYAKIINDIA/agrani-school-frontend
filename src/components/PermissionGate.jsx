import { useHasPermission, useHasAnyPermission, useHasAllPermissions } from '../context/PermissionContext';

/**
 * PermissionGate Component
 * Conditionally renders children based on user permissions
 * 
 * @param {Object} props
 * @param {string|string[]} props.permission - Required permission(s)
 * @param {string} props.mode - 'any' (default) or 'all' - how to check multiple permissions
 * @param {React.ReactNode} props.fallback - What to render if permission check fails
 * @param {React.ReactNode} props.children - Content to render if permission check passes
 */
export function PermissionGate({ permission, mode = 'any', fallback = null, children }) {
  const hasPermission = useHasPermission;
  const hasAnyPermission = useHasAnyPermission;
  const hasAllPermissions = useHasAllPermissions;

  let allowed = false;

  if (Array.isArray(permission)) {
    if (mode === 'all') {
      allowed = hasAllPermissions(permission);
    } else {
      allowed = hasAnyPermission(permission);
    }
  } else {
    allowed = hasPermission(permission);
  }

  return allowed ? children : fallback;
}

/**
 * WithPermission Component
 * Renders children only if user has the specified permission
 * Shorthand for PermissionGate with mode='any'
 */
export function WithPermission({ permission, children, fallback = null }) {
  return (
    <PermissionGate permission={permission} mode="any" fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

/**
 * WithAllPermissions Component
 * Renders children only if user has all specified permissions
 */
export function WithAllPermissions({ permissions, children, fallback = null }) {
  return (
    <PermissionGate permission={permissions} mode="all" fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

/**
 * IfPermission Component
 * Renders different content based on permission
 * 
 * @param {Object} props
 * @param {string|string[]} props.permission - Required permission(s)
 * @param {React.ReactNode} props.then - Content to render if permission granted
 * @param {React.ReactNode} props.else - Content to render if permission denied
 */
export function IfPermission({ permission, then: thenContent, else: elseContent = null }) {
  return (
    <PermissionGate permission={permission} fallback={elseContent}>
      {thenContent}
    </PermissionGate>
  );
}
