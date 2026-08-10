import { defineStore } from 'pinia';
import api from '../services/api';

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    expenses: [],
    total: 0,
    page: 1,
    limit: 20,
  }),
  actions: {
    async fetchExpenses(params = {}) {
      const res = await api.get('/expenses', { params: { page: this.page, limit: this.limit, ...params } });
      this.expenses = res.data.data;
      this.total = res.data.total;
    },
    async createExpense(payload) {
      await api.post('/expenses', payload);
    },
    async updateExpense(id, payload) {
      await api.put(`/expenses/${id}`, payload);
    },
    async deleteExpense(id) {
      await api.delete(`/expenses/${id}`);
    },
  },
});
