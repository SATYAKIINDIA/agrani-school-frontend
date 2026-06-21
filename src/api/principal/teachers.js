import api from "../../utils/axios";

export async function getTeachers() {
  try {
    const res = await api.get("/api/v1/principal/teachers", { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("getTeachers failed:", err);
    throw err;
  }
}

export async function createTeacher(payload) {
  try {
    const res = await api.post("/api/v1/principal/teachers", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("createTeacher failed:", err);
    throw err;
  }
}

export async function updateTeacher(teacherId, payload) {
  try {
    const res = await api.put(`/api/v1/principal/teachers/${teacherId}`, payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("updateTeacher failed:", err);
    throw err;
  }
}

export async function deleteTeacher(teacherId) {
  try {
    const res = await api.delete(`/api/v1/principal/teachers/${teacherId}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("deleteTeacher failed:", err);
    throw err;
  }
}

export default {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
