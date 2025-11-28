import { defineStore } from "pinia";
import { ref } from "vue";
import * as permissionsApi from "../api/permissions";
import { message } from "ant-design-vue";

export const usePermissionsStore = defineStore("permissions", () => {
  const permissions = ref<any[]>([]);
  const loading = ref(false);

  const fetchPermissions = async () => {
    loading.value = true;
    try {
      const res = await permissionsApi.getPermissions();
      permissions.value = res;
    } catch (err) {
      console.error("Error fetching permissions:", err);
      message.error("Error cargando permisos");
    } finally {
      loading.value = false;
    }
  };

  const addPermission = async (permission: any) => {
    try {
      const res = await permissionsApi.createPermission(permission);
      permissions.value.push(res);
      message.success("Permiso creado");
      return res;
    } catch (err: any) {
      console.error("Error creando permiso:", err);
      message.error(err.response?.data?.message || "Error creando permiso");
    }
  };

  const editPermission = async (id: string, permission: any) => {
    try {
      const res = await permissionsApi.updatePermission(id, permission);
      const index = permissions.value.findIndex(p => p.id === id);
      if (index !== -1) permissions.value[index] = res;
      message.success("Permiso actualizado");
    } catch (err: any) {
      console.error("Error actualizando permiso:", err);
      message.error(err.response?.data?.message || "Error actualizando permiso");
    }
  };

  const deletePermission = async (id: string) => {
    try {
      await permissionsApi.deletePermission(id);
      permissions.value = permissions.value.filter(p => p.id !== id);
      message.success("Permiso eliminado");
    } catch (err) {
      console.error("Error eliminando permiso:", err);
      message.error("Error eliminando permiso");
    }
  };

  const assignPermissionToRole = async (roleId: string, permissionId: string) => {
    try {
      await permissionsApi.assignPermission(roleId, permissionId);
      message.success("Permiso asignado al rol");
    } catch (err) {
      console.error("Error asignando permiso:", err);
      message.error("Error asignando permiso");
    }
  };

  const removePermissionFromRole = async (roleId: string, permissionId: string) => {
    try {
      await permissionsApi.removePermission(roleId, permissionId);
      message.success("Permiso removido del rol");
    } catch (err) {
      console.error("Error removiendo permiso:", err);
      message.error("Error removiendo permiso");
    }
  };

  return {
    permissions,
    loading,
    fetchPermissions,
    addPermission,
    editPermission,
    deletePermission,
    assignPermissionToRole,
    removePermissionFromRole
  };
});
