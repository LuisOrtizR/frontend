<template>
  <a-card title="Gestión de Permisos">
    <PermissionsTable @assign="openAssign" />
  </a-card>
</template>

<script setup lang="ts">
import PermissionsTable from "../../components/table/PermissionsTable.vue";

const openAssign = (permission: any) => {
  console.log("Asignar permiso", permission);
};
</script>
