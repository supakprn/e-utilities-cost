<template>
  <div class="flex min-h-screen">
    <!-- Desktop / Tablet Sidebar -->
    <aside
      class="hidden md:flex md:flex-col bg-primary-700 text-white transition-all"
      :class="collapsed ? 'md:w-16' : 'md:w-56'"
    >
      <div class="p-4 font-bold text-lg flex items-center justify-between">
        <span v-if="!collapsed">ค่าสาธารณูปโภค</span>
        <button @click="collapsed = !collapsed" class="text-white">☰</button>
      </div>
      <nav class="flex-1 flex flex-col gap-1 px-2">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-2 px-3 py-2 rounded hover:bg-primary-600"
          active-class="bg-primary-600"
        >
          <span>{{ item.icon }}</span>
          <span v-if="!collapsed">{{ item.label }}</span>
        </router-link>
      </nav>
      <button @click="handleLogout" class="m-2 px-3 py-2 text-left rounded hover:bg-primary-600">
        🚪 <span v-if="!collapsed">ออกจากระบบ</span>
      </button>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col pb-16 md:pb-0">
      <header class="bg-white border-b px-4 py-3 flex items-center justify-between md:hidden">
        <span class="font-bold text-primary-700">ค่าสาธารณูปโภค</span>
        <button @click="handleLogout" class="text-sm text-gray-500">ออกจากระบบ</button>
      </header>
      <main class="flex-1 p-4">
        <slot />
      </main>
    </div>

    <!-- Mobile bottom nav -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center text-xs text-gray-500"
        active-class="text-primary-600 font-semibold"
      >
        <span class="text-lg">{{ item.icon }}</span>
        {{ item.label }}
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const collapsed = ref(false);
const router = useRouter();
const auth = useAuthStore();

const navItems = [
  { path: '/', label: 'หน้าหลัก', icon: '📊' },
  { path: '/expenses', label: 'รายการ', icon: '📋' },
  { path: '/settings/expense-categories', label: 'ตั้งค่า', icon: '⚙️' },
  { path: '/reports', label: 'รายงาน', icon: '📈' },
];

async function handleLogout() {
  await auth.logout();
  router.push('/login');
}
</script>
