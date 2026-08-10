<template>
  <div>
    <h1 class="text-xl font-bold text-gray-800 mb-4">รายงานย้อนหลัง / เปรียบเทียบ</h1>

    <div class="bg-white rounded-lg shadow p-4 mb-4 flex gap-3 items-end">
      <div>
        <label class="block text-sm text-gray-600 mb-1">ปีที่ 1</label>
        <select v-model="year1" class="border rounded px-3 py-2">
          <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm text-gray-600 mb-1">ปีที่ 2</label>
        <select v-model="year2" class="border rounded px-3 py-2">
          <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
      <button @click="load" class="bg-primary-600 text-white rounded px-4 py-2">เปรียบเทียบ</button>
    </div>

    <div class="bg-white rounded-lg shadow overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-600">
          <tr>
            <th class="text-left px-4 py-2">เดือน</th>
            <th class="text-right px-4 py-2">{{ year1 }}</th>
            <th class="text-right px-4 py-2">{{ year2 }}</th>
            <th class="text-right px-4 py-2">ผลต่าง</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in 12" :key="m" class="border-t">
            <td class="px-4 py-2">เดือน {{ m }}</td>
            <td class="px-4 py-2 text-right">{{ formatCurrency(compareData?.year1?.[m - 1]?.total) }}</td>
            <td class="px-4 py-2 text-right">{{ formatCurrency(compareData?.year2?.[m - 1]?.total) }}</td>
            <td class="px-4 py-2 text-right" :class="diffClass(m)">
              {{ formatCurrency(diff(m)) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const currentYear = new Date().getFullYear();
const yearOptions = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];
const year1 = ref(currentYear - 1);
const year2 = ref(currentYear);
const compareData = ref(null);

function formatCurrency(v) {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(v || 0);
}

function diff(m) {
  const a = compareData.value?.year1?.[m - 1]?.total || 0;
  const b = compareData.value?.year2?.[m - 1]?.total || 0;
  return b - a;
}

function diffClass(m) {
  const d = diff(m);
  return d > 0 ? 'text-red-500' : d < 0 ? 'text-green-600' : 'text-gray-400';
}

async function load() {
  const res = await api.get('/dashboard/compare', { params: { year1: year1.value, year2: year2.value } });
  compareData.value = res.data;
}

onMounted(load);
</script>
