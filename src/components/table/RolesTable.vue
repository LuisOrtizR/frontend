<template>
  <a-card title="Gestión de Roles">
    <div class="actions" style="margin-bottom: 16px; display: flex; gap: 8px;">
      <a-input
        v-model:value="search"
        placeholder="Buscar rol..."
        allow-clear
        style="width: 220px"
      />
      <a-button type="primary" @click="openCreate">Nuevo Rol</a-button>
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
              title="¿Eliminar rol?"
              ok-text="Sí"
              cancel-text="No"
              @confirm="deleteRole(record.id)"
            >
              <a-button size="small" type="danger">Eliminar</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table-column>
    </a-table>

    <!-- Modal sincronizado -->
    <RoleModal
      v-model:open="modalOpen"
      :role="selectedRole"
      @saved="refreshRoles"
    />
  </a-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRolesStore } from "../../store/roles";
import RoleModal from "../Role/RoleModal.vue";

interface Role {
  id?: string;
  name: string;
  description: string;
}

const store = useRolesStore();
const search = ref("");

// Modal y rol seleccionado
const modalOpen = ref(false);                // solo boolean
const selectedRole = ref<Role | null>(null); // datos del rol

// Abrir modal para crear
const openCreate = () => {
  selectedRole.value = null;
  modalOpen.value = true;
};

// Abrir modal para editar
const openEdit = (role: Role) => {
  selectedRole.value = { ...role }; // copia para evitar mutaciones
  modalOpen.value = true;
};

// Refrescar roles después de guardar
const refreshRoles = () => store.fetchRoles();

// Eliminar rol
const deleteRole = async (id: string) => {
  try {
    await store.deleteRole(id);
    refreshRoles();
  } catch (err) {
    console.error(err);
  }
};

// Filtrar roles por búsqueda
const filtered = computed(() => {
  if (!search.value) return store.roles;
  return store.roles.filter(r =>
    r.name?.toLowerCase().includes(search.value.toLowerCase())
  );
});

// Cargar roles al montar
onMounted(() => store.fetchRoles());
</script>

<style scoped>
.actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
