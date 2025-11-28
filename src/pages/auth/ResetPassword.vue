<template>
  <a-card class="auth-card">
    <h2>Restablecer Contraseña</h2>

    <a-form
      layout="vertical"
      :model="form"
      :rules="rules"
      @submit.prevent="onSubmit"
    >
      <a-form-item label="Nueva Contraseña" name="password">
        <a-input-password
          v-model:value="form.password"
          placeholder="Nueva contraseña"
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" block :loading="loading">
          Cambiar contraseña
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { resetPassword } from "../../api/auth";
import { message } from "ant-design-vue";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const loading = ref(false);

    const token = route.query.token as string;

    const form = reactive({
      password: ""
    });

    const rules = {
      password: [
        { required: true, message: "La contraseña es obligatoria" },
        { min: 6, message: "Debe tener al menos 6 caracteres" }
      ]
    };

    const onSubmit = async () => {
      try {
        loading.value = true;

        const res = await resetPassword(token, form.password);
        message.success(res.message);

        router.push("/login");
      } catch (err) {
        message.error("Error al restablecer contraseña");
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
