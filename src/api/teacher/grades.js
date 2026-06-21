import api from "../../utils/axios";

export async function getClassGrades(classId) {
  try {
    const res = await api.get(`/api/v1/teacher/classes/${classId}/grades`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("getClassGrades failed:", err);
    throw err;
  }
}

export async function submitGrade(classId, payload) {
  try {
    const res = await api.post(`/api/v1/teacher/classes/${classId}/grades`, payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("submitGrade failed:", err);
    throw err;
  }
}

export async function updateGrade(gradeId, payload) {
  try {
    const res = await api.put(`/api/v1/teacher/grades/${gradeId}`, payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("updateGrade failed:", err);
    throw err;
  }
}

export default {
  getClassGrades,
  submitGrade,
  updateGrade,
};
