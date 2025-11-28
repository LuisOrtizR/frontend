import { defineStore } from "pinia";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roles?: string[];
  permissions?: string[];
}

interface AuthState {
  token: string;
  role: string;
  email: string;
  permissions: string[];
  user: User | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: localStorage.getItem("token") || "",
    role: localStorage.getItem("role") || "",
    email: localStorage.getItem("email") || "",
    permissions: JSON.parse(localStorage.getItem("permissions") || "[]") || [],
    user: null,
  }),
  actions: {
    setSession(token: string, role: string, email: string, permissions: string[]) {
      this.token = token;
      this.role = role;
      this.email = email;
      this.permissions = permissions;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);
      localStorage.setItem("permissions", JSON.stringify(permissions));
    },
    setUser(user: User) {
      this.user = user;
    },
    logout() {
      this.token = "";
      this.role = "";
      this.email = "";
      this.permissions = [];
      this.user = null;
      localStorage.clear();
    },
    hasPermission(permission: string) {
      return this.permissions.includes(permission);
    },
  },
});
