<template>
  <a-card class="auth-card">
    <h2>Recuperar Contraseña</h2>

    <a-form
      layout="vertical"
      :model="form"
      :rules="rules"
      @submit.prevent="onSubmit"
    >
      <a-form-item label="Email" name="email">
        <a-input
          v-model:value="form.email"
          type="email"
          placeholder="Ingresa tu email"
        />
      </a-form-item>

      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          block
          :loading="loading"
        >
          Enviar enlace
        </a-button>
      </a-form-item>

      <router-link to="/login">Volver al Login</router-link>
    </a-form>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { forgotPassword } from "../../api/auth";
import { message } from "ant-design-vue";

export default defineComponent({
  setup() {
    const loading = ref(false);

    const form = reactive({
      email: ""
    });

    const rules = {
      email: [
        { required: true, message: "El email es obligatorio" },
        { type: "email", message: "Formato inválido" }
      ]
    };

    const onSubmit = async () => {
      try {
        loading.value = true;
        const res = await forgotPassword(form.email);
        message.success(res.message);
      } catch (err) {
        message.error("Error al enviar enlace");
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
