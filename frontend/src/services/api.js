import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import router from '../router';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const auth = useAuthStore();

    if (error.response?.status === 401 && !original._retry && !isRefreshing) {
      original._retry = true;
      isRefreshing = true;
      try {
        const refreshed = await auth.refreshAccessToken();
        isRefreshing = false;
        if (refreshed) {
          original.headers.Authorization = `Bearer ${auth.accessToken}`;
          return api(original);
        }
      } catch (e) {
        isRefreshing = false;
      }
      auth.clearSession();
      router.push('/login');
    }

    return Promise.reject(error);
  }
);

export default api;
