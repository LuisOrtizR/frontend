<template>
  <a-modal
    :visible="isVisible"
    :title="isEdit ? 'Editar Permiso' : 'Crear Permiso'"
    ok-text="Guardar"
    cancel-text="Cancelar"
    :confirm-loading="loading"
    @ok="handleSubmit"
    @cancel="close"
  >
    <a-form layout="vertical">
      <a-form-item label="Nombre" required>
        <a-input v-model:value="form.name" placeholder="Nombre del permiso" />
      </a-form-item>
      <a-form-item label="Descripción">
        <a-input v-model:value="form.description" placeholder="Descripción del permiso" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { usePermissionsStore } from "../../store/permissions";
import { message } from "ant-design-vue";

interface Permission {
  id?: string;
  name: string;
  description: string;
}

const props = defineProps<{
  open: boolean;
  permission?: Permission | null;
}>();

const emit = defineEmits(["update:open", "saved"]);

const store = usePermissionsStore();

// Estados internos
const isVisible = ref<boolean>(props.open); // solo boolean
const loading = ref(false);
const isEdit = ref(false);
const form = ref<Permission>({ name: "", description: "" });

// Sincronizar modal con props
watch(
  () => [props.open, props.permission],
  ([open, permission]) => {
    isVisible.value = open;       // boolean
    isEdit.value = !!permission;  // true si hay permiso
    form.value = permission ? { ...permission } : { name: "", description: "" };
  },
  { immediate: true }
);

// Cerrar modal
const close = () => {
  isVisible.value = false;
  emit("update:open", false);
};

// Guardar permiso
const handleSubmit = async () => {
  if (!form.value.name) {
    message.warning("El nombre es obligatorio");
    return;
  }

  loading.value = true;
  try {
    if (isEdit.value && form.value.id) {
      await store.editPermission(form.value.id, form.value);
      message.success("Permiso actualizado");
    } else {
      await store.addPermission(form.value);
      message.success("Permiso creado");
    }
    emit("saved"); // notifica al padre
    close();
  } catch (err) {
    console.error(err);
    message.error("Error guardando el permiso");
  } finally {
    loading.value = false;
  }
};
</script>
