import api from "../../utils/axios";

export async function getStudents() {
  try {
    const res = await api.get("/api/v1/principal/students", { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("getStudents failed:", err);
    throw err;
  }
}

export async function createStudent(payload) {
  try {
    const res = await api.post("/api/v1/principal/students", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("createStudent failed:", err);
    throw err;
  }
}

export async function updateStudent(studentId, payload) {
  try {
    const res = await api.put(`/api/v1/principal/students/${studentId}`, payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("updateStudent failed:", err);
    throw err;
  }
}

export async function deleteStudent(studentId) {
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
