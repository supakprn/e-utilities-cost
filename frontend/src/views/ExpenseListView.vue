<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold text-gray-800">รายการค่าใช้จ่าย</h1>
      <router-link to="/expenses/create" class="bg-primary-600 text-white px-4 py-2 rounded">
        + เพิ่มรายการ
      </router-link>
    </div>

    <div class="bg-white rounded-lg shadow p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
      <select v-model="filters.year" @change="load" class="border rounded px-2 py-2">
        <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
      </select>
      <select v-model="filters.month" @change="load" class="border rounded px-2 py-2">
        <option value="">ทุกเดือน</option>
        <option v-for="m in 12" :key="m" :value="m">เดือน {{ m }}</option>
      </select>
      <select v-model="filters.expense_category_id" @change="load" class="border rounded px-2 py-2">
        <option value="">ทุกประเภท</option>
        <option v-for="c in categoryStore.expenseCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <select v-model="filters.budget_category_id" @change="load" class="border rounded px-2 py-2">
        <option value="">ทุกหมวดเงิน</option>
        <option v-for="c in categoryStore.budgetCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
    </div>

    <!-- Desktop table -->
    <div class="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-600">
          <tr>
            <th class="text-left px-4 py-2">เดือนบิล</th>
            <th class="text-left px-4 py-2">ประเภท</th>
            <th class="text-left px-4 py-2">หมวดเงิน</th>
            <th class="text-right px-4 py-2">จำนวนเงิน</th>
            <th class="text-left px-4 py-2">เลขที่ใบแจ้งหนี้</th>
            <th class="text-center px-4 py-2">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in expenseStore.expenses" :key="e.id" class="border-t">
            <td class="px-4 py-2">{{ e.billing_month }}</td>
            <td class="px-4 py-2">{{ e.expenseCategory?.name }}</td>
            <td class="px-4 py-2">{{ e.budgetCategory?.name }}</td>
            <td class="px-4 py-2 text-right">{{ formatCurrency(e.amount) }}</td>
            <td class="px-4 py-2">{{ e.invoice_no || '-' }}</td>
            <td class="px-4 py-2 text-center space-x-2">
              <router-link :to="`/expenses/${e.id}/edit`" class="text-primary-600">แก้ไข</router-link>
              <button @click="handleDelete(e.id)" class="text-red-500">ลบ</button>
            </td>
          </tr>
          <tr v-if="!expenseStore.expenses.length">
            <td colspan="6" class="text-center text-gray-400 py-6">ยังไม่มีรายการ</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile card list -->
    <div class="md:hidden space-y-3">
      <div v-for="e in expenseStore.expenses" :key="e.id" class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between">
          <span class="font-semibold">{{ e.expenseCategory?.name }}</span>
          <span class="font-bold text-primary-700">{{ formatCurrency(e.amount) }}</span>
        </div>
        <p class="text-sm text-gray-500">{{ e.billing_month }} · {{ e.budgetCategory?.name }}</p>
        <div class="mt-2 flex gap-3 text-sm">
          <router-link :to="`/expenses/${e.id}/edit`" class="text-primary-600">แก้ไข</router-link>
          <button @click="handleDelete(e.id)" class="text-red-500">ลบ</button>
        </div>
      </div>
      <p v-if="!expenseStore.expenses.length" class="text-center text-gray-400 py-6">ยังไม่มีรายการ</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useExpenseStore } from '../stores/expense';
import { useCategoryStore } from '../stores/category';

const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();

const currentYear = new Date().getFullYear();
const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

const filters = reactive({
  year: currentYear,
  month: '',
  expense_category_id: '',
  budget_category_id: '',
});

function formatCurrency(v) {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(v || 0);
}

async function load() {
  await expenseStore.fetchExpenses({ ...filters });
}

async function handleDelete(id) {
  if (!confirm('ยืนยันการลบรายการนี้?')) return;
  await expenseStore.deleteExpense(id);
  await load();
}

onMounted(async () => {
  await Promise.all([categoryStore.fetchExpenseCategories(), categoryStore.fetchBudgetCategories()]);
  await load();
});
</script>
