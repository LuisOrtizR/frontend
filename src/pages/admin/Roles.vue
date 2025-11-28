<template>
  <a-card title="Gestión de Roles">
    <RolesTable @edit="openEdit" />
  </a-card>
</template>

<script setup lang="ts">
import RolesTable from "../../components/table/RolesTable.vue";

const openEdit = (role: any) => {
  console.log("Editar rol", role);
};
</script>
