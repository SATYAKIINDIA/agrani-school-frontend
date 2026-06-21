import api from "../../utils/axios";
import { ApiResponse } from '../../../types';

export async function getStudents(): Promise<ApiResponse<any>> {
  try {
    const res = await api.get("/api/v1/principal/students", { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("getStudents failed:", err);
    throw err;
  }
}

export async function createStudent(payload: any): Promise<ApiResponse<any>> {
  try {
    const res = await api.post("/api/v1/principal/students", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("createStudent failed:", err);
    throw err;
  }
}

export async function updateStudent(studentId: number, payload: any): Promise<ApiResponse<any>> {
  try {
    const res = await api.put(`/api/v1/principal/students/${studentId}`, payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("updateStudent failed:", err);
    throw err;
  }
}

export async function deleteStudent(studentId: number): Promise<ApiResponse<any>> {
  try {
    const res = await api.delete(`/api/v1/principal/students/${studentId}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("deleteStudent failed:", err);
    throw err;
  }
}

export default {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
};
