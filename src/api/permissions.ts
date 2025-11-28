import axios from "axios";

const API_URL = "http://localhost:3000/permissions";

export const getPermissions = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const createPermission = async (permission: { name: string; description?: string }) => {
  const { data } = await axios.post(API_URL, permission);
  return data;
};

export const updatePermission = async (id: string, permission: { name?: string; description?: string }) => {
  const { data } = await axios.patch(`${API_URL}/${id}`, permission);
  return data;
};

export const deletePermission = async (id: string) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};

export const assignPermission = async (roleId: string, permissionId: string) => {
  const { data } = await axios.post(`${API_URL}/assign`, { roleId, permissionId });
  return data;
};

export const removePermission = async (roleId: string, permissionId: string) => {
  const { data } = await axios.delete(`${API_URL}/remove`, { data: { roleId, permissionId } });
  return data;
};
