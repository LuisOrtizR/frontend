<template>
  <a-card title="Gestión de Productos">
    <div class="actions" style="margin-bottom: 16px; display: flex; gap: 8px;">
      <a-input
        v-model:value="search"
        placeholder="Buscar..."
        style="width: 220px"
        allow-clear
      />
      <a-button type="primary" @click="openCreate">Nuevo Producto</a-button>
    </div>

    <a-table :data-source="filtered" :loading="store.loading" row-key="id">
      <a-table-column title="Nombre" data-index="name" />
      <a-table-column title="Descripción" data-index="description" />
      <a-table-column title="Precio">
        <template #bodyCell="{ record }">
          $ {{ record.price.toLocaleString() }}
        </template>
      </a-table-column>
      <a-table-column title="Stock" data-index="stock" />
      <a-table-column title="Estado">
        <template #bodyCell="{ record }">
          <a-badge
            :status="record.isActive ? 'success' : 'default'"
            :text="record.isActive ? 'Activo' : 'Inactivo'"
          />
        </template>
      </a-table-column>
      <a-table-column title="Acciones">
        <template #bodyCell="{ record }">
          <a-space>
            <a-button size="small" type="default" @click="openEdit(record)">
              <EditOutlined />
            </a-button>
            <a-popconfirm
              title="¿Desactivar producto?"
              ok-text="Sí"
              cancel-text="No"
              @confirm="deactivateProduct(record.id)"
            >
              <a-button size="small" type="danger">
                <DeleteOutlined />
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table-column>
    </a-table>
  </a-card>

  <!-- Modal de producto -->
  <ProductModal v-model:open="modalOpen" :product="selected" @saved="refreshProducts" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useProductsStore } from "../../store/products";
import ProductModal from "../products/ProductModal.vue";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

const store = useProductsStore();
const search = ref("");
const modalOpen = ref(false);
const selected = ref<any>(null);

// Abrir modal para crear
const openCreate = () => {
  selected.value = null;
  modalOpen.value = true;
};

// Abrir modal para editar
const openEdit = (product: any) => {
  selected.value = product;
  modalOpen.value = true;
};

// Refrescar productos
const refreshProducts = () => {
  store.fetchProducts();
};

// Filtrar productos por search
const filtered = computed(() => {
  if (!search.value) return store.products;
  return store.products.filter((p) =>
    p.name?.toLowerCase().includes(search.value.toLowerCase())
  );
});

// Desactivar producto
const deactivateProduct = async (id: string) => {
  try {
    await store.deactivate(id);
  } catch (error) {
    console.error(error);
    message.error("No se pudo desactivar el producto");
  }
};

// Cargar productos al montar
onMounted(() => {
  store.fetchProducts();
});
</script>

<style scoped>
.actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
