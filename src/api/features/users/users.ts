import api from "../../utils/axios";
import { ApiResponse } from '../../../types';

export async function getUsers(): Promise<ApiResponse<any>> {
  try {
    const res = await api.get("/api/v1/superadmin/users", { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("getUsers failed:", err);
    throw err;
  }
}

export async function createUser(payload: any): Promise<ApiResponse<any>> {
  try {
    const res = await api.post("/api/v1/superadmin/users", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("createUser failed:", err);
    throw err;
  }
}

export async function updateUser(userId: number, payload: any): Promise<ApiResponse<any>> {
  try {
    const res = await api.put(`/api/v1/superadmin/users/${userId}`, payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("updateUser failed:", err);
    throw err;
  }
}

export async function deleteUser(userId: number): Promise<ApiResponse<any>> {
  try {
    const res = await api.delete(`/api/v1/superadmin/users/${userId}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("deleteUser failed:", err);
    throw err;
  }
}

export default {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
