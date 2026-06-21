import api from "../../utils/axios";
import { ApiResponse } from '../../../types';

export async function getMyClasses(): Promise<ApiResponse<any>> {
  try {
    const res = await api.get("/api/v1/teacher/classes", { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("getMyClasses failed:", err);
    throw err;
  }
}

export async function getClassDetails(classId: number): Promise<ApiResponse<any>> {
  try {
    const res = await api.get(`/api/v1/teacher/classes/${classId}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("getClassDetails failed:", err);
    throw err;
  }
}

export default {
  getMyClasses,
  getClassDetails,
};
