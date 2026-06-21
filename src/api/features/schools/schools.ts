import api from "../../utils/axios";
import { ApiResponse } from '../../../types';

export async function getSchools(): Promise<ApiResponse<any>> {
  try {
    const res = await api.get("/api/v1/superadmin/schools", { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("getSchools failed:", err);
    throw err;
  }
}

export async function createSchool(payload: any): Promise<ApiResponse<any>> {
  try {
    const res = await api.post("/api/v1/superadmin/schools", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("createSchool failed:", err);
    throw err;
  }
}

export async function updateSchool(schoolId: number, payload: any): Promise<ApiResponse<any>> {
  try {
    const res = await api.put(`/api/v1/superadmin/schools/${schoolId}`, payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("updateSchool failed:", err);
    throw err;
  }
}

export async function deleteSchool(schoolId: number): Promise<ApiResponse<any>> {
  try {
    const res = await api.delete(`/api/v1/superadmin/schools/${schoolId}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("deleteSchool failed:", err);
    throw err;
  }
}

export default {
  getSchools,
  createSchool,
  updateSchool,
  deleteSchool,
};
