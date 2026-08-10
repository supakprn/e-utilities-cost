<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold text-gray-800">แดชบอร์ด</h1>
      <select v-model="year" @change="loadAll" class="border rounded px-3 py-2">
        <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <SummaryCard label="ยอดรวมเดือนนี้" :value="thisMonthTotal" :change="changePercent" />
      <SummaryCard label="ยอดรวมเดือนก่อน" :value="lastMonthTotal" />
      <SummaryCard label="ยอดรวมปีนี้" :value="summary?.yearTotal || 0" />
      <SummaryCard label="เฉลี่ยต่อเดือน" :value="avgPerMonth" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="bg-white rounded-lg shadow p-4 lg:col-span-2 h-80">
        <h2 class="font-semibold mb-2">ยอดรายเดือนตลอดปี</h2>
        <div class="h-64">
          <MonthlyBarChart v-if="summary" :months="summary.months" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4 h-80">
        <h2 class="font-semibold mb-2">สัดส่วนตามประเภทค่าใช้จ่าย</h2>
        <div class="h-64">
          <CategoryPieChart v-if="byCategory.length" :items="byCategory" />
          <p v-else class="text-gray-400 text-sm">ยังไม่มีข้อมูล</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-4 mt-4">
      <h2 class="font-semibold mb-2">สัดส่วนตามหมวดเงิน</h2>
      <ul class="divide-y">
        <li v-for="b in byBudget" :key="b.id" class="flex justify-between py-2">
          <span>{{ b.name }}</span>
          <span class="font-medium">{{ formatCurrency(b.total) }}</span>
        </li>
        <li v-if="!byBudget.length" class="text-gray-400 text-sm py-2">ยังไม่มีข้อมูล</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';
import SummaryCard from '../components/charts/SummaryCard.vue';
import MonthlyBarChart from '../components/charts/MonthlyBarChart.vue';
import CategoryPieChart from '../components/charts/CategoryPieChart.vue';

const currentYear = new Date().getFullYear();
const year = ref(currentYear);
const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

const summary = ref(null);
const byCategory = ref([]);
const byBudget = ref([]);

const thisMonthIdx = new Date().getMonth(); // 0-based
const thisMonthTotal = computed(() => summary.value?.months?.[thisMonthIdx]?.total || 0);
const lastMonthTotal = computed(() => summary.value?.months?.[thisMonthIdx - 1]?.total || 0);
const changePercent = computed(() => {
  if (!lastMonthTotal.value) return null;
  return ((thisMonthTotal.value - lastMonthTotal.value) / lastMonthTotal.value) * 100;
});
const avgPerMonth = computed(() => {
  if (!summary.value) return 0;
  const monthsWithData = summary.value.months.filter((m) => m.total > 0).length || 1;
  return summary.value.yearTotal / monthsWithData;
});

function formatCurrency(v) {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(v || 0);
}

async function loadAll() {
  const [s, c, b] = await Promise.all([
    api.get('/dashboard/summary', { params: { year: year.value } }),
    api.get('/dashboard/by-category', { params: { year: year.value } }),
    api.get('/dashboard/by-budget', { params: { year: year.value } }),
  ]);
  summary.value = s.data;
  byCategory.value = c.data;
  byBudget.value = b.data;
}

onMounted(loadAll);
</script>
