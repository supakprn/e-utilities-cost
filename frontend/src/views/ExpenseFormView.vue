<template>
  <div class="max-w-lg mx-auto">
    <h1 class="text-xl font-bold text-gray-800 mb-4">{{ isEdit ? 'แก้ไขรายการ' : 'เพิ่มรายการค่าใช้จ่าย' }}</h1>
    <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow p-6 space-y-4">
      <div>
        <label class="block text-sm text-gray-600 mb-1">ประเภทค่าใช้จ่าย</label>
        <select v-model="form.expense_category_id" required class="w-full border rounded px-3 py-2">
          <option value="" disabled>เลือกประเภท</option>
          <option v-for="c in categoryStore.expenseCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm text-gray-600 mb-1">หมวดเงินที่เบิก</label>
        <select v-model="form.budget_category_id" required class="w-full border rounded px-3 py-2">
          <option value="" disabled>เลือกหมวดเงิน</option>
          <option v-for="c in categoryStore.budgetCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm text-gray-600 mb-1">จำนวนเงิน (บาท)</label>
        <input v-model.number="form.amount" type="number" step="0.01" min="0" required class="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm text-gray-600 mb-1">เดือน/ปีของบิล</label>
        <input v-model="form.billing_month" type="date" required class="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm text-gray-600 mb-1">วันที่ชำระจริง</label>
        <input v-model="form.paid_date" type="date" class="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm text-gray-600 mb-1">เลขที่ใบแจ้งหนี้</label>
        <input v-model="form.invoice_no" type="text" class="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm text-gray-600 mb-1">หมายเหตุ</label>
        <textarea v-model="form.note" rows="3" class="w-full border rounded px-3 py-2"></textarea>
      </div>
      <div class="flex gap-3">
        <button type="submit" class="flex-1 bg-primary-600 text-white rounded py-2">บันทึก</button>
        <router-link to="/expenses" class="flex-1 text-center border rounded py-2">ยกเลิก</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useExpenseStore } from '../stores/expense';
import { useCategoryStore } from '../stores/category';
import api from '../services/api';

const route = useRoute();
const router = useRouter();
const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();

const isEdit = computed(() => !!route.params.id);

const form = reactive({
  expense_category_id: '',
  budget_category_id: '',
  amount: null,
  billing_month: '',
  paid_date: '',
  invoice_no: '',
  note: '',
});

async function handleSubmit() {
  if (isEdit.value) {
    await expenseStore.updateExpense(route.params.id, form);
  } else {
    await expenseStore.createExpense(form);
  }
  router.push('/expenses');
}

onMounted(async () => {
  await Promise.all([categoryStore.fetchExpenseCategories(), categoryStore.fetchBudgetCategories()]);
  if (isEdit.value) {
    const res = await api.get(`/expenses/${route.params.id}`);
    Object.assign(form, {
      expense_category_id: res.data.expense_category_id,
      budget_category_id: res.data.budget_category_id,
      amount: Number(res.data.amount),
      billing_month: res.data.billing_month,
      paid_date: res.data.paid_date || '',
      invoice_no: res.data.invoice_no || '',
      note: res.data.note || '',
    });
  }
});
</script>
