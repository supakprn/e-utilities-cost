import { defineStore } from 'pinia';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    user: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
    isAdmin: (state) => state.user?.role === 'admin',
  },
  actions: {
    async login(username, password) {
      const res = await axios.post(`${baseURL}/auth/login`, { username, password }, { withCredentials: true });
      this.accessToken = res.data.accessToken;
      this.user = res.data.user;
    },
    async logout() {
      try {
        await axios.post(`${baseURL}/auth/logout`, {}, { withCredentials: true });
      } finally {
        this.clearSession();
      }
    },
    async refreshAccessToken() {
      try {
        const res = await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
        this.accessToken = res.data.accessToken;
        return true;
      } catch (e) {
        return false;
      }
    },
    clearSession() {
      this.accessToken = null;
      this.user = null;
    },
  },
});
