import api from "../utils/axios";

export async function postLogin(payload) {
  try {
    const res = await api.post("/api/v1/auth/login", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("postLogin failed:", err);
    throw err;
  }
}

export async function postRegister(payload) {
  try {
    const res = await api.post("/api/v1/auth/register", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("postRegister failed:", err);
    throw err;
  }
}

export async function postLogout(payload = {}) {
  try {
    const res = await api.post("/api/v1/auth/logout", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("postLogout failed:", err);
    throw err;
  }
}

export async function postRefresh() {
  try {
    const res = await api.post("/api/v1/auth/refresh-token", null, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("postRefresh failed:", err);
    throw err;
  }
}

export async function postRequestOtp(payload) {
  try {
    const res = await api.post("/api/v1/otp/request", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("postRequestOtp failed:", err);
    throw err;
  }
}

export async function postVerifyOtp(payload) {
  try {
    const res = await api.post("/api/v1/otp/verify", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("postVerifyOtp failed:", err);
    throw err;
  }
}

export default {
  postLogin,
  postRegister,
  postLogout,
  postRefresh,
  postRequestOtp,
  postVerifyOtp,
};
