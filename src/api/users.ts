import axios from "axios";
import { useAuthStore } from "../store/auth";

const API_URL = "http://localhost:3000/users";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${useAuthStore().token}` }
});

// Listar usuarios (Admin/Manager)
export const listUsers = async () => {
  const { data } = await axios.get(`${API_URL}/list`, authHeader());
  return data;
};

// Crear usuario
export const createUser = async (user: any) => {
  const { data } = await axios.post(`${API_URL}/create`, user, authHeader());
  return data;
};

// Actualizar usuario
export const updateUser = async (id: string, user: any) => {
  const { data } = await axios.patch(`${API_URL}/update/${id}`, user, authHeader());
  return data;
};

// Desactivar usuario
export const deactivateUser = async (id: string) => {
  const { data } = await axios.patch(`${API_URL}/deactivate/${id}`, {}, authHeader());
  return data;
};

// Eliminar usuario
export const deleteUser = async (id: string) => {
  const { data } = await axios.delete(`${API_URL}/delete/${id}`, authHeader());
  return data;
};

// Obtener perfil del usuario logueado
export const getProfile = async () => {
  const { data } = await axios.get(`${API_URL}/profile`, authHeader());
  return data.user; // devuelve solo el objeto usuario
};
