<template>
  <Pie :data="chartData" :options="options" />
</template>

<script setup>
import { computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  items: { type: Array, required: true }, // [{name, total}]
});

const palette = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

const chartData = computed(() => ({
  labels: props.items.map((i) => i.name),
  datasets: [
    {
      data: props.items.map((i) => Number(i.total)),
      backgroundColor: palette,
    },
  ],
}));

const options = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>
