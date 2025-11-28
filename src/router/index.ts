import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { useAuthStore } from "../store/auth";

// Layout principal
import MainLayout from "../components/layout/MainLayout.vue";

// Páginas públicas
import Login from "../pages/auth/Login.vue";
import Register from "../pages/auth/Register.vue";
import ForgotPassword from "../pages/auth/ForgotPassword.vue";
import ResetPassword from "../pages/auth/ResetPassword.vue";

// Páginas privadas
import Home from "../pages/Home.vue";
import Dashboard from "../pages/dashboard/Dashboard.vue";
import Users from "../pages/users/Users.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login, meta: { public: true } },
  { path: "/register", component: Register, meta: { public: true } },
  { path: "/forgot-password", component: ForgotPassword, meta: { public: true } },
  { path: "/reset-password", component: ResetPassword, meta: { public: true } },

  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "home", component: Home },
      { path: "dashboard", component: Dashboard, meta: { roles: ["Admin", "Manager"] } },
      { path: "users", component: Users, meta: { roles: ["Admin", "Manager"] } },
      { path: "products", component: () => import("../pages/products/Products.vue"), meta: { roles: ["Admin", "Manager"] } },
      { path: "roles", component: () => import("../pages/admin/Roles.vue"), meta: { roles: ["Admin", "Manager"] } },
      { path: "permissions", component: () => import("../pages/admin/Permissions.vue"), meta: { roles: ["Admin", "Manager"] } },
      { path: "profile", component: () => import("../pages/profile/Profile.vue"), meta: { roles: ["Customer"] } },
    ]
  },

  { path: "/:pathMatch(.*)*", redirect: "/home" }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware autenticación + roles
router.beforeEach((to, _, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.token) return next("/login");

  if (auth.token && to.meta.public) {
    return auth.role === "Customer" ? next("/home") : next("/dashboard");
  }

  if (to.meta.roles) {
    const roles = to.meta.roles as string[];
    if (!roles.includes(auth.role)) {
      return auth.role === "Customer" ? next("/home") : next("/dashboard");
    }
  }

  next();
});

export default router;
