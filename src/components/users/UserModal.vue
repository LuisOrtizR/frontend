<template>
  <a-modal
    :open="localOpen"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="close"
    title="Usuario"
    destroy-on-close
  >
    <a-form layout="vertical">
      <a-form-item label="Email">
        <a-input v-model:value="form.email" />
      </a-form-item>

      <a-form-item label="Rol">
        <a-select v-model:value="form.roleId" placeholder="Selecciona un rol">
          <a-select-option
            v-for="r in rolesStore.roles"
            :key="r.id"
            :value="r.id"
          >
            {{ r.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import { useUsersStore } from "../../store/users";
import { useRolesStore } from "../../store/roles";

const props = defineProps<{
  open: boolean;
  user: any;
}>();

const emit = defineEmits(["update:open"]);

const usersStore = useUsersStore();
const rolesStore = useRolesStore();

const localOpen = ref(false);
const loading = ref(false);

const form = ref({
  email: "",
  roleId: null as string | null,
});

// 🔹 Poblado correcto de formulario al editar
watch(
  () => props.open,
  (val) => {
    localOpen.value = val;
    if (val && props.user) {
      form.value = {
        email: props.user.email,
        roleId: props.user.roles?.[0]?.role.id || null,
      };
    } else {
      form.value = { email: "", roleId: null };
    }
  }
);

const close = () => emit("update:open", false);

const handleOk = async () => {
  loading.value = true;
  try {
    let userId;

    // 🔹 Crear o editar usuario
    if (props.user) {
      await usersStore.editUser(props.user.id, { email: form.value.email });
      userId = props.user.id;
    } else {
      const newUser = await usersStore.addUser({ email: form.value.email });
      userId = newUser.id;
    }

    // 🔹 Asignar rol si se selecciona uno
    if (form.value.roleId) {
      await rolesStore.assign(userId, form.value.roleId);
    }

    message.success("Usuario guardado correctamente");
    close();
  } finally {
    loading.value = false;
  }
};
</script>
