// src/store/products.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import * as productsApi from "../api/products";
import { message } from "ant-design-vue";

export const useProductsStore = defineStore("products", () => {
  const products = ref<any[]>([]);
  const loading = ref(false);

  // Fetch de productos
  const fetchProducts = async (params?: any) => {
    loading.value = true;
    try {
      const res = await productsApi.getProducts(params);
      // La API devuelve { page, limit, total, data }
      const items = res.data || [];
      products.value = items.map((p: any) => ({
        ...p,
        price: Number(p.price) || 0,
        isActive: p.isActive ?? true
      }));
    } catch (error: any) {
      console.error("Error fetching products:", error);
      message.error(error.response?.data?.message || "Error al cargar productos");
    } finally {
      loading.value = false;
    }
  };

  // Crear producto
  const addProduct = async (product: any) => {
    try {
      const res = await productsApi.createProduct(product);
      const newProduct = {
        ...res,
        price: Number(res.price) || 0,
        isActive: res.isActive ?? true
      };
      products.value.push(newProduct);
      message.success("Producto creado correctamente");
      return newProduct;
    } catch (error: any) {
      console.error("Error al crear producto:", error);
      message.error(error.response?.data?.message || "Error al crear producto");
      throw error;
    }
  };

  // Editar producto
  const editProduct = async (id: string, product: any) => {
    try {
      const res = await productsApi.updateProduct(id, product);
      const index = products.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        products.value[index] = {
          ...res,
          price: Number(res.price) || 0,
          isActive: res.isActive ?? true
        };
      }
      message.success("Producto actualizado correctamente");
      return res;
    } catch (error: any) {
      console.error("Error al actualizar producto:", error);
      message.error(error.response?.data?.message || "Error al actualizar producto");
      throw error;
    }
  };

  // Desactivar producto (soft delete)
  const deactivate = async (id: string) => {
    try {
      const res = await productsApi.deactivateProduct(id);
      const product = products.value.find((p) => p.id === id);
      if (product) product.isActive = false;
      message.success("Producto desactivado correctamente");
      return res;
    } catch (error: any) {
      console.error("Error al desactivar producto:", error);
      message.error(error.response?.data?.message || "Error al desactivar producto");
      throw error;
    }
  };

  return {
    products,
    loading,
    fetchProducts,
    addProduct,
    editProduct,
    deactivate
  };
});
