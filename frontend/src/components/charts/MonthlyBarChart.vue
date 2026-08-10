<template>
  <Bar :data="chartData" :options="options" />
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  months: { type: Array, required: true }, // [{month, total}]
});

const labels = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

const chartData = computed(() => ({
  labels,
  datasets: [
    {
      label: 'ยอดรายเดือน (บาท)',
      backgroundColor: '#2563eb',
      data: props.months.map((m) => m.total),
    },
  ],
}));

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
};
</script>
