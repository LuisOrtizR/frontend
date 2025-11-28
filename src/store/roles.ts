import { defineStore } from "pinia";
import * as rolesApi from "../api/roles";
import { ref } from "vue";
import { message } from "ant-design-vue";

export const useRolesStore = defineStore("roles", () => {
  const roles = ref<any[]>([]);
  const loading = ref(false);

  const fetchRoles = async () => {
    loading.value = true;
    try {
      const res = await rolesApi.getRoles();
      roles.value = res;
    } catch (err) {
      console.error("Error fetching roles:", err);
      message.error("Error cargando roles");
    } finally {
      loading.value = false;
    }
  };

  const addRole = async (role: any) => {
    try {
      const res = await rolesApi.createRole(role);
      roles.value.push(res);
      message.success("Rol creado");
      return res;
    } catch (err: any) {
      console.error("Error creando rol:", err);
      message.error(err.response?.data?.message || "Error creando rol");
    }
  };

  const editRole = async (id: string, role: any) => {
    try {
      const res = await rolesApi.updateRole(id, role);
      const index = roles.value.findIndex(r => r.id === id);
      if (index !== -1) roles.value[index] = res;
      message.success("Rol actualizado");
    } catch (err: any) {
      console.error("Error actualizando rol:", err);
      message.error(err.response?.data?.message || "Error actualizando rol");
    }
  };

  const deleteRole = async (id: string) => {
    try {
      await rolesApi.deleteRole(id);
      roles.value = roles.value.filter(r => r.id !== id);
      message.success("Rol eliminado");
    } catch (err) {
      console.error("Error eliminando rol:", err);
      message.error("Error eliminando rol");
    }
  };

  const assign = async (userId: string, roleId: string) => {
    try {
      await rolesApi.assignRoleToUser(userId, roleId);
      message.success("Rol asignado al usuario correctamente");
    } catch (err: any) {
      console.error("Error asignando rol:", err);
      message.error(err.response?.data?.message || "Error asignando rol");
      throw err;
    }
  };

  return { roles, loading, fetchRoles, addRole, editRole, deleteRole, assign };
});
