<template>
  <a-modal
    :visible="isVisible"
    title="Producto"
    ok-text="Guardar"
    cancel-text="Cancelar"
    @ok="handleSubmit"
    @cancel="close"
  >
    <a-form layout="vertical">
      <a-form-item label="Nombre" required>
        <a-input v-model:value="form.name" />
      </a-form-item>

      <a-form-item label="Descripción">
        <a-input v-model:value="form.description" />
      </a-form-item>

      <a-form-item label="Precio" required>
        <a-input-number v-model:value="form.price" :min="0" style="width: 100%" />
      </a-form-item>

      <a-form-item label="Stock" required>
        <a-input-number v-model:value="form.stock" :min="0" style="width: 100%" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useProductsStore } from "../../store/products";

const props = defineProps<{ open: boolean; product?: any }>();
const emit = defineEmits(["update:open"]);

const store = useProductsStore();

// Prop interna para controlar la visibilidad
const isVisible = ref(props.open);

// Formulario
const form = ref({
  id: "",
  name: "",
  description: "",
  price: 0,
  stock: 0,
});

// Cuando cambie el producto o la apertura del modal
watch(
  () => [props.product, props.open],
  ([product, open]) => {
    isVisible.value = open;
    if (product) {
      form.value = {
        id: product.id || "",
        name: product.name || "",
        description: product.description || "",
        price: Number(product.price) || 0,
        stock: product.stock || 0,
      };
    } else {
      form.value = { id: "", name: "", description: "", price: 0, stock: 0 };
    }
  },
  { immediate: true }
);

const close = () => {
  isVisible.value = false;
  emit("update:open", false);
};

const handleSubmit = async () => {
  const payload = {
    name: form.value.name,
    description: form.value.description,
    price: Number(form.value.price),
    stock: Number(form.value.stock),
  };

  try {
    if (form.value.id) {
      await store.editProduct(form.value.id, payload);
    } else {
      await store.addProduct(payload);
    }
    close();
  } catch (error: any) {
    console.error("Error al guardar producto:", error.response?.data || error);
    // Mensaje de error visual
    import("ant-design-vue").then(({ message }) => {
      message.error(error.response?.data?.message || "Error al guardar producto");
    });
  }
};

</script>
