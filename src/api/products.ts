// src/api/products.ts
import axios from "axios";

const API_URL = "http://localhost:3000/products";

export const getProducts = async (params?: any) => {
  const { data } = await axios.get(API_URL, { params });
  return data;
};

export const getProduct = async (id: string) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

export const createProduct = async (product: any) => {
  const { data } = await axios.post(API_URL, product);
  return data;
};

export const updateProduct = async (id: string, product: any) => {
  const { data } = await axios.patch(`${API_URL}/${id}`, product);
  return data;
};

export const deactivateProduct = async (id: string) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};
