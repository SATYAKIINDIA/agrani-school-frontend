/**
 * Session Manager
 * 
 * Handles session timeout, idle timeout, and session management.
 * Automatically logs out user after inactivity or session expiration.
 */

const SESSION_TIMEOUT_KEY = 'sessionTimeout';
const IDLE_TIMEOUT_KEY = 'idleTimeout';
const LAST_ACTIVITY_KEY = 'lastActivity';

// Default timeouts (in milliseconds)
const DEFAULT_SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const DEFAULT_IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes

let idleTimer: number | null = null;
let sessionTimer: number | null = null;
let onSessionExpired: (() => void) | null = null;

/**
 * Initialize session manager with custom timeouts
 * @param sessionTimeout - Session timeout in milliseconds
 * @param idleTimeout - Idle timeout in milliseconds
 * @param onExpired - Callback when session expires
 */
export function initSessionManager(
  sessionTimeout: number = DEFAULT_SESSION_TIMEOUT,
  idleTimeout: number = DEFAULT_IDLE_TIMEOUT,
  onExpired?: () => void
) {
  onSessionExpired = onExpired || (() => {
    // Default: reload page to trigger auth check
    window.location.href = '/login';
  });

  localStorage.setItem(SESSION_TIMEOUT_KEY, sessionTimeout.toString());
  localStorage.setItem(IDLE_TIMEOUT_KEY, idleTimeout.toString());
  updateLastActivity();

  // Start timers
  startSessionTimer(sessionTimeout);
  startIdleTimer(idleTimeout);

  // Setup activity listeners
  setupActivityListeners();
}

/**
 * Update last activity timestamp
 */
export function updateLastActivity() {
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  resetIdleTimer();
}

/**
 * Start session timer
 */
function startSessionTimer(timeout: number) {
  if (sessionTimer) clearTimeout(sessionTimer);
  
  sessionTimer = setTimeout(() => {
    if (onSessionExpired) onSessionExpired();
  }, timeout);
}

/**
 * Start idle timer
 */
function startIdleTimer(timeout: number) {
  if (idleTimer) clearTimeout(idleTimer);
  
  idleTimer = setTimeout(() => {
    if (onSessionExpired) onSessionExpired();
  }, timeout);
}

/**
 * Reset idle timer on activity
 */
function resetIdleTimer() {
  const idleTimeout = parseInt(localStorage.getItem(IDLE_TIMEOUT_KEY) || DEFAULT_IDLE_TIMEOUT.toString());
  startIdleTimer(idleTimeout);
}

/**
 * Setup activity event listeners
 */
function setupActivityListeners() {
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
  
  events.forEach(event => {
    document.addEventListener(event, updateLastActivity);
  });
}

/**
 * Remove activity event listeners
 */
function removeActivityListeners() {
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
  
  events.forEach(event => {
    document.removeEventListener(event, updateLastActivity);
  });
}

/**
 * Check if session is expired
 * @returns true if session is expired
 */
export function isSessionExpired(): boolean {
  const lastActivity = parseInt(localStorage.getItem(LAST_ACTIVITY_KEY) || '0');
  const sessionTimeout = parseInt(localStorage.getItem(SESSION_TIMEOUT_KEY) || DEFAULT_SESSION_TIMEOUT.toString());
  
  return Date.now() - lastActivity > sessionTimeout;
}

/**
 * Get remaining session time in milliseconds
 * @returns Remaining time or 0 if expired
 */
export function getSessionTimeRemaining(): number {
  const lastActivity = parseInt(localStorage.getItem(LAST_ACTIVITY_KEY) || '0');
  const sessionTimeout = parseInt(localStorage.getItem(SESSION_TIMEOUT_KEY) || DEFAULT_SESSION_TIMEOUT.toString());
  
  const elapsed = Date.now() - lastActivity;
  return Math.max(0, sessionTimeout - elapsed);
}

/**
 * Clear session manager timers and listeners
 */
export function clearSessionManager() {
  if (sessionTimer) clearTimeout(sessionTimer);
  if (idleTimer) clearTimeout(idleTimer);
  removeActivityListeners();
  
  sessionTimer = null;
  idleTimer = null;
  onSessionExpired = null;
}
