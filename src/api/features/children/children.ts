import api from "../../utils/axios";
import { ApiResponse } from '../../../types';

export async function getMyChildren(): Promise<ApiResponse<any>> {
  try {
    const res = await api.get("/api/v1/parent/children", { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("getMyChildren failed:", err);
    throw err;
  }
}

export async function getChildDetails(childId: number): Promise<ApiResponse<any>> {
  try {
    const res = await api.get(`/api/v1/parent/children/${childId}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("getChildDetails failed:", err);
    throw err;
  }
}

export async function getChildGrades(childId: number): Promise<ApiResponse<any>> {
  try {
    const res = await api.get(`/api/v1/parent/children/${childId}/grades`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("getChildGrades failed:", err);
    throw err;
  }
}

export async function getChildAttendance(childId: number): Promise<ApiResponse<any>> {
  try {
    const res = await api.get(`/api/v1/parent/children/${childId}/attendance`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("getChildAttendance failed:", err);
    throw err;
  }
}

export default {
  getMyChildren,
  getChildDetails,
  getChildGrades,
  getChildAttendance,
};
