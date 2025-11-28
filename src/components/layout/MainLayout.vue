<template>
  <a-layout style="min-height: 100vh">
    <NavBar v-if="auth.token" />
    <a-layout-content style="padding: 24px;">
      <RouterView />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./NavBar.vue";
import { useAuthStore } from "../../store/auth";

const auth = useAuthStore();
</script>
