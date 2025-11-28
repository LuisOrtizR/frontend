import { defineStore } from "pinia";
import { listUsers, createUser, updateUser, deactivateUser, deleteUser } from "../api/users";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [],
    loading: false,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await listUsers();
        this.users = response.users; // <-- Correcto
      } finally {
        this.loading = false;
      }
    },

    async addUser(user) {
      const response = await createUser(user);
      this.fetchUsers();
      return response.user;
    },

    async editUser(id, user) {
      await updateUser(id, user);
      this.fetchUsers();
    },

    async deactivate(id) {
      await deactivateUser(id);
      this.fetchUsers();
    },

    async remove(id) {
      await deleteUser(id);
      this.fetchUsers();
    },
  },
});
