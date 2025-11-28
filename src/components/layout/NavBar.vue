<template>
  <a-layout-header style="display: flex; align-items: center; justify-content: space-between;">
    <div style="color: white; font-weight: bold; font-size: 18px;">MiApp</div>

    <a-menu theme="dark" mode="horizontal" :selectedKeys="[selectedKey]">
      <!-- Menú general -->
      <a-menu-item key="home" v-if="auth.token">
        <RouterLink to="/home">Inicio</RouterLink>
      </a-menu-item>

      <!-- Menú Admin/Manager -->
      <template v-if="auth.token && ['Admin','Manager'].includes(auth.role)">
        <a-menu-item key="dashboard"><RouterLink to="/dashboard">Dashboard</RouterLink></a-menu-item>
        <a-menu-item key="users"><RouterLink to="/users">Usuarios</RouterLink></a-menu-item>
        <a-menu-item key="products"><RouterLink to="/products">Productos</RouterLink></a-menu-item>
        <a-menu-item key="roles"><RouterLink to="/roles">Roles</RouterLink></a-menu-item>
        <a-menu-item key="permissions"><RouterLink to="/permissions">Permisos</RouterLink></a-menu-item>
      </template>

      <!-- Menú Customer -->
      <template v-if="auth.token && auth.role === 'Customer'">
        <a-menu-item key="profile"><RouterLink to="/profile">Mi Perfil</RouterLink></a-menu-item>
      </template>
    </a-menu>

    <div v-if="auth.token" style="display: flex; align-items: center; gap: 14px;">
      <span style="color: white;">👋 {{ auth.email }}</span>
      <a-button danger size="small" @click="confirmLogout">Cerrar sesión</a-button>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../store/auth";
import { Modal, message } from "ant-design-vue";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const selectedKey = computed(() => route.path.replace("/", ""));

const confirmLogout = () => {
  Modal.confirm({
    title: "¿Cerrar sesión?",
    content: "Tu sesión será finalizada",
    okText: "Sí",
    cancelText: "No",
    okType: "danger",
    onOk() {
      auth.logout();
      message.success("Sesión cerrada correctamente");
      router.push("/login");
    }
  });
};
</script>
