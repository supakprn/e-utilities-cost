<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <form @submit.prevent="handleLogin" class="bg-white shadow rounded-lg p-8 w-full max-w-sm">
      <h1 class="text-xl font-bold text-primary-700 mb-6 text-center">
        ระบบควบคุมค่าสาธารณูปโภค
      </h1>
      <div class="mb-4">
        <label class="block text-sm text-gray-600 mb-1">Username</label>
        <input v-model="username" type="text" required class="w-full border rounded px-3 py-2" />
      </div>
      <div class="mb-6">
        <label class="block text-sm text-gray-600 mb-1">Password</label>
        <input v-model="password" type="password" required class="w-full border rounded px-3 py-2" />
      </div>
      <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-primary-600 hover:bg-primary-700 text-white rounded py-2 disabled:opacity-50"
      >
        {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const router = useRouter();
const auth = useAuthStore();

async function handleLogin() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(username.value, password.value);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ';
  } finally {
    loading.value = false;
  }
}
</script>
