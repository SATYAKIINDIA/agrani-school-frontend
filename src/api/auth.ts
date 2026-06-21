import api from "../utils/axios";
import { LoginCredentials, ApiResponse } from '../types';

export async function postLogin(payload: LoginCredentials): Promise<ApiResponse<any>> {
  try {
    const res = await api.post("/api/v1/membership/login", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("postLogin failed:", err);
    throw err;
  }
}

export async function postRegister(payload: any): Promise<ApiResponse<any>> {
  try {
    const res = await api.post("/api/v1/auth/register", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("postRegister failed:", err);
    throw err;
  }
}

export async function postLogout(payload: any = {}): Promise<ApiResponse<any>> {
  try {
    const res = await api.post("/api/v1/auth/logout", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("postLogout failed:", err);
    throw err;
  }
}

export async function postRefresh(): Promise<ApiResponse<any>> {
  try {
    const res = await api.post("/api/v1/auth/refresh-token", null, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("postRefresh failed:", err);
    throw err;
  }
}

export async function postForgotPassword(payload: any): Promise<ApiResponse<any>> {
  try {
    const res = await api.post("/api/v1/auth/forgot-password", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("postForgotPassword failed:", err);
    throw err;
  }
}

export async function postResetPassword(payload: any): Promise<ApiResponse<any>> {
  try {
    const res = await api.post("/api/v1/auth/reset-password", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("postResetPassword failed:", err);
    throw err;
  }
}

export async function postRequestOtp(payload: any): Promise<ApiResponse<any>> {
  try {
    const res = await api.post("/api/v1/otp/request", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("postRequestOtp failed:", err);
    throw err;
  }
}

export async function postVerifyOtp(payload: any): Promise<ApiResponse<any>> {
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
  postForgotPassword,
  postResetPassword,
  postRequestOtp,
  postVerifyOtp,
};
