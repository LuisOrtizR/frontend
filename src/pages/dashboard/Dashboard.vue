<template>
  <!-- Resumen -->
  <a-row :gutter="[16, 16]">
    <a-col :span="6">
      <a-card>
        <a-statistic title="Usuarios" :value="users.length" />
      </a-card>
    </a-col>
    <a-col :span="6">
      <a-card>
        <a-statistic title="Roles" :value="roles.length" />
      </a-card>
    </a-col>
    <a-col :span="6">
      <a-card>
        <a-statistic title="Permisos" :value="permissions.length" />
      </a-card>
    </a-col>
    <a-col :span="6">
      <a-card>
        <a-statistic title="Productos" :value="products.length" />
      </a-card>
    </a-col>
  </a-row>

  <!-- Gráficas -->
  <a-row :gutter="[16, 16]" style="margin-top: 24px;">
    <a-col :span="12">
      <a-card title="Usuarios por rol">
        <Bar :data="usersByRole" xField="role" yField="count" />
      </a-card>
    </a-col>
    <a-col :span="12">
      <a-card title="Productos activos vs inactivos">
        <Pie :data="productsStatus" angleField="count" colorField="status" />
      </a-card>
    </a-col>
  </a-row>

  <!-- Últimos usuarios -->
  <a-card title="Últimos usuarios registrados" style="margin-top: 24px;">
    <a-table :data-source="recentUsers" row-key="id">
      <a-table-column title="Nombre" data-index="name" />
      <a-table-column title="Email" data-index="email" />
      <a-table-column title="Creado" data-index="createdAt" />
    </a-table>
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUsersStore } from "../../store/users";
import { useRolesStore } from "../../store/roles";
import { usePermissionsStore } from "../../store/permissions";
import { useProductsStore } from "../../store/products";
import { Bar, Pie } from "@ant-design/charts";

// Stores
const usersStore = useUsersStore();
const rolesStore = useRolesStore();
const permissionsStore = usePermissionsStore();
const productsStore = useProductsStore();

// Datos
interface User {
  id: string;
  name: string;
  email: string;
  role?: { name: string };
  createdAt: string;
}
interface Role { id: string; name: string }
interface Permission { id: string; name: string }
interface Product { id: string; name: string; isActive: boolean }

const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const permissions = ref<Permission[]>([]);
const products = ref<Product[]>([]);

// Datos para gráficas
const usersByRole = ref<{ role: string; count: number }[]>([]);
const productsStatus = ref<{ status: string; count: number }[]>([]);
const recentUsers = ref<User[]>([]);

onMounted(async () => {
  // Cargar datos desde los stores y devolver siempre array
  users.value = (await usersStore.fetchUsers()) ?? [];
  roles.value = (await rolesStore.fetchRoles()) ?? [];
  permissions.value = (await permissionsStore.fetchPermissions()) ?? [];
  products.value = (await productsStore.fetchProducts()) ?? [];

  // Usuarios por rol
  const roleCounts: Record<string, number> = {};
  users.value.forEach(u => {
    const roleName = u.role?.name || "Sin rol";
    roleCounts[roleName] = (roleCounts[roleName] || 0) + 1;
  });
  usersByRole.value = Object.entries(roleCounts).map(([role, count]) => ({ role, count }));

  // Productos activos/inactivos
  const active = products.value.filter(p => p.isActive).length;
  const inactive = products.value.length - active;
  productsStatus.value = [
    { status: "Activo", count: active },
    { status: "Inactivo", count: inactive }
  ];

  // Últimos usuarios registrados
  recentUsers.value = [...users.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});
</script>

<style scoped>
/* Opcional: spacing entre tarjetas y gráficas */
</style>
