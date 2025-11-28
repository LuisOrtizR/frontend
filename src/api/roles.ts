import axios from "axios";

const API_URL = "http://localhost:3000/roles";

export const getRoles = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const getRole = async (id: string) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

export const createRole = async (role: { name: string; description?: string }) => {
  const { data } = await axios.post(API_URL, role);
  return data;
};

export const updateRole = async (id: string, role: { name?: string; description?: string }) => {
  const { data } = await axios.patch(`${API_URL}/${id}`, role);
  return data;
};

export const deleteRole = async (id: string) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};

export const assignRoleToUser = async (userId: string, roleId: string) => {
  const { data } = await axios.post(`${API_URL}/assign`, { userId, roleId });
  return data;
};

export const removeRoleFromUser = async (userId: string, roleId: string) => {
  const { data } = await axios.delete(`${API_URL}/remove`, { data: { userId, roleId } });
  return data;
};
