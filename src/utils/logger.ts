/**
 * Client-side Logger
 * 
 * Provides structured logging with different log levels.
 * Logs can be sent to backend for monitoring and debugging.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
}

const LOG_STORAGE_KEY = 'app_logs';
const MAX_LOGS = 100;

/**
 * Log a message with specified level
 * @param level - Log level
 * @param message - Log message
 * @param context - Additional context data
 */
export function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
    userId: localStorage.getItem('userId') || undefined,
    sessionId: localStorage.getItem('sessionId') || undefined,
  };

  // Console output
  const consoleMethod = level === 'debug' ? 'log' : level;
  console[consoleMethod](`[${level.toUpperCase()}]`, message, context || '');

  // Store logs locally
  storeLog(entry);

  // Send to backend in production
  if (import.meta.env.PROD && (level === 'error' || level === 'warn')) {
    sendLogToBackend(entry);
  }
}

/**
 * Store log entry in localStorage
 */
function storeLog(entry: LogEntry) {
  try {
    const logs = getStoredLogs();
    logs.push(entry);
    
    // Keep only last MAX_LOGS
    if (logs.length > MAX_LOGS) {
      logs.shift();
    }
    
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    // Ignore storage errors
  }
}

/**
 * Get stored logs from localStorage
 */
export function getStoredLogs(): LogEntry[] {
  try {
    const logs = localStorage.getItem(LOG_STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Clear stored logs
 */
export function clearLogs() {
  localStorage.removeItem(LOG_STORAGE_KEY);
}

/**
 * Send log to backend
 */
async function sendLogToBackend(entry: LogEntry) {
  try {
    const { env } = await import('./env');
    await fetch(`${env.API_BASE}/api/v1/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(entry),
    });
  } catch (e) {
    // Silently fail
  }
}

/**
 * Convenience functions for each log level
 */
export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => log('debug', message, context),
  info: (message: string, context?: Record<string, unknown>) => log('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => log('error', message, context),
};
