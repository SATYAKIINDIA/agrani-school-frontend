import api from "../../utils/axios";
import { ApiResponse } from '../../../types';

export async function getClassAttendance(classId: number, date?: string): Promise<ApiResponse<any>> {
  try {
    const res = await api.get(`/api/v1/teacher/classes/${classId}/attendance`, { 
      params: { date },
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    console.error("getClassAttendance failed:", err);
    throw err;
  }
}

export async function markAttendance(classId: number, payload: any): Promise<ApiResponse<any>> {
  try {
    const res = await api.post(`/api/v1/teacher/classes/${classId}/attendance`, payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("markAttendance failed:", err);
    throw err;
  }
}

export default {
  getClassAttendance,
  markAttendance,
};
