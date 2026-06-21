import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { env } from './env';

/**
 * Axios instance configured for API requests
 * 
 * Features:
 * - Automatic token refresh on 401 errors
 * - Request cancellation for GET requests
 * - Membership context headers
 * - httpOnly cookie support
 */
const BASE_URL = env.API_BASE;

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Store for abort controllers
const abortControllers = new Map<string, AbortController>();

// Generate unique request ID
let requestId = 0;
function getRequestId(): string {
  return `req_${++requestId}`;
}

// Request interceptor to add tenant context headers and cancellation
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get active membership from localStorage
    const activeMembershipId = localStorage.getItem('activeMembershipId');
    
    if (activeMembershipId) {
      // Add membership context to headers for additional data isolation
      config.headers = config.headers || {};
      config.headers['X-Membership-Id'] = activeMembershipId;
    }
    
    // Add request cancellation for GET requests using AbortController
    if (config.method === 'get') {
      const reqId = getRequestId();
      const controller = new AbortController();
      config.signal = controller.signal;
      (config as any).reqId = reqId;
      abortControllers.set(reqId, controller);
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to clean up abort controllers
api.interceptors.response.use(
  (res: AxiosResponse) => {
    const reqId = (res.config as any).reqId;
    if (reqId) {
      abortControllers.delete(reqId);
    }
    return res;
  },
  async (err: AxiosError) => {
    const reqId = (err.config as any)?.reqId;
    if (reqId) {
      abortControllers.delete(reqId);
    }
    
    if (!err.response) return Promise.reject(err);

    const { status } = err.response;
    const original = err.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (status === 401 && !original?._retry) {
      original._retry = true;
      try {
        await refreshAccessToken();
        return api(original);
      } catch (e) {
        // Dispatch auth expired event (AuthContext will handle logout)
        window.dispatchEvent(
          new CustomEvent("auth:expired", {
            detail: { redirect: window.location.pathname + window.location.search },
          })
        );
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);

/**
 * Cancel all pending requests
 * Useful for cleanup on component unmount or route changes
 */
export function cancelAllRequests() {
  abortControllers.forEach((controller) => controller.abort());
  abortControllers.clear();
}

/**
 * Cancel a specific request by ID
 * @param reqId - Request ID to cancel
 */
export function cancelRequest(reqId: string) {
  const controller = abortControllers.get(reqId);
  if (controller) {
    controller.abort();
    abortControllers.delete(reqId);
  }
}

/**
 * Refresh access token using httpOnly cookie
 * @returns Promise<boolean> - True if refresh succeeded
 */
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const url = `${BASE_URL.replace(/\/$/, "")}/api/v1/auth/refresh-token`;
        const res = await axios.post(url, null, { withCredentials: true });

        if (!res || (res.status !== 200 && res.status !== 201)) {
          throw new Error("Unexpected refresh response");
        }

        return true;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err: AxiosError) => {
    if (!err.response) return Promise.reject(err);

    const { status } = err.response;
    const original = err.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (status === 401 && !original?._retry) {
      original._retry = true;
      try {
        await refreshAccessToken();
        return api(original);
      } catch (e) {
        // Dispatch auth expired event (AuthContext will handle logout)
        window.dispatchEvent(
          new CustomEvent("auth:expired", {
            detail: { redirect: window.location.pathname + window.location.search },
          })
        );
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
