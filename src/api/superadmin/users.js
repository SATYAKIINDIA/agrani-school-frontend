import api from "../../utils/axios";

export async function getUsers() {
  try {
    const res = await api.get("/api/v1/superadmin/users", { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("getUsers failed:", err);
    throw err;
  }
}

export async function createUser(payload) {
  try {
    const res = await api.post("/api/v1/superadmin/users", payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("createUser failed:", err);
    throw err;
  }
}

export async function updateUser(userId, payload) {
  try {
    const res = await api.put(`/api/v1/superadmin/users/${userId}`, payload, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("updateUser failed:", err);
    throw err;
  }
}

export async function deleteUser(userId) {
  try {
    const res = await api.delete(`/api/v1/superadmin/users/${userId}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("deleteUser failed:", err);
    throw err;
  }
}

export default {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
