<template>
  <a-modal
    :title="isEdit ? 'Editar Rol' : 'Crear Rol'"
    :visible="isVisible"
    ok-text="Guardar"
    cancel-text="Cancelar"
    :confirm-loading="loading"
    @ok="handleSubmit"
    @cancel="close"
  >
    <a-form layout="vertical">
      <a-form-item label="Nombre" required>
        <a-input v-model:value="form.name" placeholder="Nombre del rol" />
      </a-form-item>
      <a-form-item label="Descripción">
        <a-input v-model:value="form.description" placeholder="Descripción del rol" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRolesStore } from "../../store/roles";
import { message } from "ant-design-vue";

interface Role {
  id?: string;
  name: string;
  description: string;
}

const props = defineProps<{
  open: boolean;
  role?: Role | null;
}>();
const emit = defineEmits(["update:open", "saved"]);

const store = useRolesStore();
const loading = ref(false);
const isEdit = ref(false);
const isVisible = ref(props.open);
const form = ref<Role>({ name: "", description: "" });

// Sincronizar modal con props
watch(
  () => [props.open, props.role],
  ([open, role]) => {
    isVisible.value = open;
    isEdit.value = !!role;
    form.value = role ? { ...role } : { name: "", description: "" };
  },
  { immediate: true }
);

// Cerrar modal
const close = () => {
  isVisible.value = false;
  emit("update:open", false);
};

// Guardar rol
const handleSubmit = async () => {
  if (!form.value.name) {
    message.warning("El nombre es obligatorio");
    return;
  }

  loading.value = true;
  try {
    if (isEdit.value && form.value.id) {
      await store.editRole(form.value.id, form.value);
      message.success("Rol actualizado");
    } else {
      await store.addRole(form.value);
      message.success("Rol creado");
    }
    emit("saved");
    close();
  } catch (err) {
    console.error(err);
    message.error("Error guardando el rol");
  } finally {
    loading.value = false;
  }
};
</script>
