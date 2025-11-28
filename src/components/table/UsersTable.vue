<template>
  <a-card title="Gestión de Usuarios">
    <div class="actions">
      <a-input-search
        v-model:value="search"
        placeholder="Buscar email..."
        style="width: 220px"
      />
      <a-button type="primary" @click="openCreate">Nuevo Usuario</a-button>
    </div>

    <a-table
      :data-source="filteredUsers"
      :loading="usersStore.loading"
      row-key="id"
    >
      <!-- Email -->
      <a-table-column title="Email" data-index="email" />

      <!-- Roles -->
      <a-table-column title="Rol">
        <template #bodyCell="{ record }">
          <a-tag v-if="record.roles?.length">
            {{ record.roles.map(r => r.role?.name).join(', ') }}
          </a-tag>
          <a-tag v-else color="default">Sin rol</a-tag>
        </template>
      </a-table-column>

      <!-- Estado -->
      <a-table-column title="Estado">
        <template #bodyCell="{ record }">
          <a-tag :color="record.isActive ? 'green' : 'red'">
            {{ record.isActive ? 'Activo' : 'Inactivo' }}
          </a-tag>
        </template>
      </a-table-column>

      <!-- Acciones -->
      <a-table-column title="Acciones">
        <template #bodyCell="{ record }">
          <a-space>
            <a-button size="small" @click="openEdit(record)">Editar</a-button>

            <a-popconfirm
              :title="record.isActive ? '¿Desactivar usuario?' : '¿Reactivar usuario?'"
              ok-text="Sí"
              cancel-text="No"
              @confirm="usersStore.deactivate(record.id)"
            >
              <a-button size="small" danger>
                {{ record.isActive ? 'Desactivar' : 'Reactivar' }}
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table-column>
    </a-table>
  </a-card>

  <UserModal v-model:open="modalOpen" :user="selectedUser" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUsersStore } from "../../store/users";
import { useRolesStore } from "../../store/roles";
import UserModal from "../../components/users/UserModal.vue";

const usersStore = useUsersStore();
const rolesStore = useRolesStore(); // 👈 Corrección correcta

const search = ref("");
const modalOpen = ref(false);
const selectedUser = ref<any>(null);

const openCreate = () => {
  selectedUser.value = null;
  modalOpen.value = true;
};

const openEdit = (user: any) => {
  selectedUser.value = user;
  modalOpen.value = true;
};

const filteredUsers = computed(() =>
  usersStore.users.filter((u) =>
    u.email.toLowerCase().includes(search.value.toLowerCase())
  )
);

onMounted(() => {
  usersStore.fetchUsers();
  rolesStore.fetchRoles(); // 👈 Cargar roles desde el inicio
});
</script>

<style scoped>
.actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
</style>
