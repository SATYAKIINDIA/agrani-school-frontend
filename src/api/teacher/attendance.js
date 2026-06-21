import api from "../../utils/axios";

export async function getClassAttendance(classId, date) {
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

export async function markAttendance(classId, payload) {
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
