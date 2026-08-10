<template>
  <div>
    <div class="flex gap-4 mb-4 border-b">
      <router-link
        to="/settings/expense-categories"
        class="pb-2 px-1"
        :class="isExpenseTab ? 'border-b-2 border-primary-600 text-primary-700 font-semibold' : 'text-gray-500'"
      >
        ประเภทค่าใช้จ่าย
      </router-link>
      <router-link
        to="/settings/budget-categories"
        class="pb-2 px-1"
        :class="!isExpenseTab ? 'border-b-2 border-primary-600 text-primary-700 font-semibold' : 'text-gray-500'"
      >
        หมวดเงิน
      </router-link>
    </div>

    <form @submit.prevent="handleAdd" class="bg-white rounded-lg shadow p-4 mb-4 flex flex-col md:flex-row gap-3">
      <input v-model="newItem.name" placeholder="ชื่อ" required class="flex-1 border rounded px-3 py-2" />
      <input v-model="newItem.code" placeholder="รหัส (เช่น ELEC)" required class="w-full md:w-40 border rounded px-3 py-2" />
      <button type="submit" class="bg-primary-600 text-white rounded px-4 py-2">เพิ่ม</button>
    </form>

    <div class="bg-white rounded-lg shadow divide-y">
      <div v-for="item in items" :key="item.id" class="flex items-center justify-between px-4 py-3">
        <div>
          <p class="font-medium">{{ item.name }}</p>
          <p class="text-xs text-gray-400">{{ item.code }}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs" :class="item.is_active ? 'text-green-600' : 'text-gray-400'">
            {{ item.is_active ? 'ใช้งาน' : 'ปิดใช้งาน' }}
          </span>
          <button @click="toggleActive(item)" class="text-primary-600 text-sm">สลับสถานะ</button>
          <button @click="handleDelete(item.id)" class="text-red-500 text-sm">ลบ</button>
        </div>
      </div>
      <p v-if="!items.length" class="text-center text-gray-400 py-6">ยังไม่มีข้อมูล</p>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCategoryStore } from '../stores/category';

const route = useRoute();
const categoryStore = useCategoryStore();

const isExpenseTab = computed(() => route.name === 'expense-categories');
const items = computed(() =>
  isExpenseTab.value ? categoryStore.expenseCategories : categoryStore.budgetCategories
);

const newItem = reactive({ name: '', code: '' });

async function loadCurrent() {
  if (isExpenseTab.value) await categoryStore.fetchExpenseCategories();
  else await categoryStore.fetchBudgetCategories();
}

async function handleAdd() {
  if (isExpenseTab.value) {
    await categoryStore.createExpenseCategory({ ...newItem });
  } else {
    await categoryStore.createBudgetCategory({ ...newItem });
  }
  newItem.name = '';
  newItem.code = '';
}

async function toggleActive(item) {
  const payload = { is_active: !item.is_active };
  if (isExpenseTab.value) await categoryStore.updateExpenseCategory(item.id, payload);
  else await categoryStore.updateBudgetCategory(item.id, payload);
}

async function handleDelete(id) {
  if (!confirm('ยืนยันการลบ?')) return;
  if (isExpenseTab.value) await categoryStore.deleteExpenseCategory(id);
  else await categoryStore.deleteBudgetCategory(id);
}

watch(() => route.name, loadCurrent);
onMounted(loadCurrent);
</script>
