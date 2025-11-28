<template>
  <a-card title="Gestión de Permisos">
    <div class="actions" style="margin-bottom: 16px; display: flex; gap: 8px;">
      <a-input
        v-model:value="search"
        placeholder="Buscar permiso..."
        allow-clear
        style="width: 220px"
      />
      <a-button type="primary" @click="openCreate">Nuevo Permiso</a-button>
    </div>

    <a-table :data-source="filtered" :loading="store.loading" row-key="id">
      <a-table-column title="Nombre" data-index="name" />
      <a-table-column title="Descripción" data-index="description" />
      <a-table-column title="Acciones">
        <template #bodyCell="{ record }">
          <a-space>
            <a-button size="small" type="default" @click="openEdit(record)">
              Editar
            </a-button>
            <a-popconfirm
              title="¿Eliminar permiso?"
              ok-text="Sí"
              cancel-text="No"
              @confirm="deletePermission(record.id)"
            >
              <a-button size="small" type="danger">Eliminar</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table-column>
    </a-table>

    <!-- Modal sincronizado -->
    <PermissionModal
      v-model:open="modalOpen"
      :permission="selectedPermission"
      @saved="refreshPermissions"
    />
  </a-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { usePermissionsStore } from "../../store/permissions";
import PermissionModal from "../Permission/PermissionModal.vue";

interface Permission {
  id?: string;
  name: string;
  description: string;
}

const store = usePermissionsStore();
const search = ref("");

// Modal y permiso seleccionado
const modalOpen = ref(false);                 // solo boolean
const selectedPermission = ref<Permission | null>(null); // datos del permiso

// Abrir modal para crear
const openCreate = () => {
  selectedPermission.value = null;
  modalOpen.value = true;
};

// Abrir modal para editar
const openEdit = (permission: Permission) => {
  selectedPermission.value = { ...permission };
  modalOpen.value = true;
};

// Refrescar permisos después de guardar
const refreshPermissions = () => store.fetchPermissions();

// Eliminar permiso
const deletePermission = async (id: string) => {
  try {
    await store.deletePermission(id);
    refreshPermissions();
  } catch (err) {
    console.error(err);
  }
};

// Filtrar permisos por búsqueda
const filtered = computed(() => {
  if (!search.value) return store.permissions;
  return store.permissions.filter(p =>
    p.name?.toLowerCase().includes(search.value.toLowerCase())
  );
});

// Cargar permisos al montar
onMounted(() => store.fetchPermissions());
</script>

<style scoped>
.actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
