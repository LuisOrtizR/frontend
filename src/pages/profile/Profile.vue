<template>
  <a-card title="Perfil de usuario" style="max-width: 500px; margin: 20px auto;">
    <a-form layout="vertical">
      <a-form-item label="Nombre">
        <a-input v-model:value="form.name" placeholder="Tu nombre" />
      </a-form-item>

      <a-form-item label="Email">
        <a-input v-model:value="form.email" disabled />
      </a-form-item>

      <a-form-item label="Avatar">
        <a-upload
          :before-upload="beforeUpload"
          :show-upload-list="false"
          :custom-request="uploadAvatar"
        >
          <a-button>Subir avatar</a-button>
        </a-upload>
        <img v-if="form.avatar" :src="form.avatar" alt="avatar" style="margin-top:10px; width:100px; border-radius:50%;" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" :loading="loading" @click="updateProfile">
          Guardar cambios
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import { useAuthStore } from "../../store/auth";
import { getProfile, updateUser } from "../../api/users";

const auth = useAuthStore();
const loading = ref(false);

const form = ref({
  name: "",
  email: "",
  avatar: "",
});

onMounted(async () => {
  try {
    const user = await getProfile(); // obtiene info desde backend
    form.value = {
      name: user.name || "",
      email: user.email,
      avatar: user.avatar || "",
    };
    auth.setUser(user); // sincroniza store
  } catch (err) {
    console.error(err);
    message.error("No se pudo cargar la información del perfil");
  }
});

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) message.error("Solo se permiten imágenes");
  return isImage;
};

const uploadAvatar = async ({ file, onSuccess }: any) => {
  const reader = new FileReader();
  reader.onload = () => {
    form.value.avatar = reader.result as string;
    onSuccess("ok");
  };
  reader.readAsDataURL(file);
};

const updateProfile = async () => {
  if (!auth.user) return;

  loading.value = true;
  try {
    const user = auth.user;
    await updateUser(user.id, { name: form.value.name, avatar: form.value.avatar });
    message.success("Perfil actualizado correctamente");
    auth.setUser({ ...user, name: form.value.name, avatar: form.value.avatar });
  } catch (err) {
    console.error(err);
    message.error("Error actualizando el perfil");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
img {
  display: block;
}
</style>
