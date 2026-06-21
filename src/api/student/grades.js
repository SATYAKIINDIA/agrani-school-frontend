import api from "../../utils/axios";

export async function getMyGrades() {
  try {
    const res = await api.get("/api/v1/student/grades", { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("getMyGrades failed:", err);
    throw err;
  }
}

export async function getGradeDetails(gradeId) {
  try {
    const res = await api.get(`/api/v1/student/grades/${gradeId}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("getGradeDetails failed:", err);
    throw err;
  }
}

export default {
  getMyGrades,
  getGradeDetails,
};
