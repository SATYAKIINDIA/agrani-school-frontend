import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let refreshPromise = null;

async function refreshAccessToken() {
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
  (res) => res,
  async (err) => {
    if (!err.response) return Promise.reject(err);

    const { status } = err.response;
    const original = err.config;

    if (status === 401 && !original?._retry) {
      original._retry = true;
      try {
        await refreshAccessToken();
        return api(original);
      } catch (e) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
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
