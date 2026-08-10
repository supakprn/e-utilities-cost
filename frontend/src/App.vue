<template>
  <div class="min-h-screen bg-gray-50">
    <template v-if="auth.isLoggedIn">
      <AppLayout>
        <router-view />
      </AppLayout>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth';
import AppLayout from './components/layout/AppLayout.vue';

const auth = useAuthStore();
</script>
