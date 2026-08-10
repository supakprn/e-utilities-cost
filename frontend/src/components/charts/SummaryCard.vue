<template>
  <div class="bg-white rounded-lg shadow p-4">
    <p class="text-sm text-gray-500">{{ label }}</p>
    <p class="text-2xl font-bold text-primary-700 mt-1">{{ formattedValue }}</p>
    <p v-if="change !== null" class="text-xs mt-1" :class="change >= 0 ? 'text-red-500' : 'text-green-600'">
      {{ change >= 0 ? '▲' : '▼' }} {{ Math.abs(change).toFixed(1) }}% จากเดือนก่อน
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: String,
  value: Number,
  change: { type: Number, default: null },
});

const formattedValue = computed(() =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(props.value || 0)
);
</script>
