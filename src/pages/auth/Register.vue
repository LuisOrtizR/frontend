<template>
  <a-card class="auth-card">
    <h2>Crear Cuenta</h2>

    <a-form
      layout="vertical"
      :model="form"
      :rules="rules"
      @submit.prevent="onSubmit"
    >
      <a-form-item label="Email" name="email">
        <a-input v-model:value="form.email" placeholder="Email" />
      </a-form-item>

      <a-form-item label="Contraseña" name="password">
        <a-input-password
          v-model:value="form.password"
          placeholder="Contraseña"
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" block :loading="loading">
          Registrar
        </a-button>
      </a-form-item>

      <router-link to="/login">Ya tengo cuenta</router-link>
    </a-form>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { register } from "../../api/auth";
import { message } from "ant-design-vue";

export default defineComponent({
  setup() {
    const router = useRouter();
    const loading = ref(false);

    const form = reactive({
      email: "",
      password: ""
    });

    const rules = {
      email: [
        { required: true, message: "El email es obligatorio" },
        { type: "email", message: "Formato inválido" }
      ],
      password: [
        { required: true, message: "La contraseña es obligatoria" },
        { min: 6, message: "Debe tener al menos 6 caracteres" }
      ]
    };

    const onSubmit = async () => {
      try {
        loading.value = true;

        const res = await register(form.email, form.password);
        message.success(res.message);

        router.push("/login");
      } catch (err) {
        message.error("Error al registrar");
      } finally {
        loading.value = false;
      }
    };

    return { form, rules, loading, onSubmit };
  }
});
</script>

<style scoped>
.auth-card {
  max-width: 380px;
  margin: auto;
  margin-top: 40px;
}
</style>
