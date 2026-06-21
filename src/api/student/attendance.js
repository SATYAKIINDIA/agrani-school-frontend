import api from "../../utils/axios";

export async function getMyAttendance() {
  try {
    const res = await api.get("/api/v1/student/attendance", { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("getMyAttendance failed:", err);
    throw err;
  }
}

export async function getAttendanceByDate(date) {
  try {
    const res = await api.get("/api/v1/student/attendance", { 
      params: { date },
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    console.error("getAttendanceByDate failed:", err);
    throw err;
  }
}

export default {
  getMyAttendance,
  getAttendanceByDate,
};
