<template>
  <a-card class="auth-card">
    <h2>Iniciar Sesión</h2>

    <a-form
      layout="vertical"
      :model="form"
      :rules="rules"
      @submit.prevent="onSubmit"
    >
      <a-form-item label="Email" name="email">
        <a-input v-model:value="form.email" placeholder="Ingresa tu email" />
      </a-form-item>

      <a-form-item label="Contraseña" name="password">
        <a-input-password
          v-model:value="form.password"
          placeholder="Ingresa tu contraseña"
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" block :loading="loading">
          Entrar
        </a-button>
      </a-form-item>

      <div class="links">
        <router-link to="/register">Crear cuenta</router-link>
        <router-link to="/forgot-password">¿Olvidaste tu contraseña?</router-link>
      </div>
    </a-form>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/auth";
import { login } from "../../api/auth";
import { message } from "ant-design-vue";
import { jwtDecode } from "jwt-decode";

export default defineComponent({
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
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
      password: [{ required: true, message: "La contraseña es obligatoria" }]
    };

    const onSubmit = async () => {
      try {
        loading.value = true;

        const res = await login(form.email, form.password);

        const decoded: any = jwtDecode(res.access_token);
const role = decoded?.roles?.[0] ?? "Customer";
const permissions = decoded?.permissions ?? [];

// Guardamos datos completos del usuario
authStore.setSession(res.access_token, role, form.email, permissions);

message.success(`Bienvenido, ${role}`);

// Redirección por rol
if (role === "Customer") {
  router.push("/home");
} else {
  router.push("/dashboard");
}

      } catch (err) {
        message.error("Credenciales incorrectas");
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
.links {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
