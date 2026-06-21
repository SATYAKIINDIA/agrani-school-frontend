import api from "../../utils/axios";

export async function getMyClasses() {
  try {
    const res = await api.get("/api/v1/teacher/classes", { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("getMyClasses failed:", err);
    throw err;
  }
}

export async function getClassDetails(classId) {
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
