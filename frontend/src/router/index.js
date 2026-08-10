import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  { path: '/', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { requiresAuth: true } },
  { path: '/expenses', name: 'expenses', component: () => import('../views/ExpenseListView.vue'), meta: { requiresAuth: true } },
  { path: '/expenses/create', name: 'expense-create', component: () => import('../views/ExpenseFormView.vue'), meta: { requiresAuth: true } },
  { path: '/expenses/:id/edit', name: 'expense-edit', component: () => import('../views/ExpenseFormView.vue'), meta: { requiresAuth: true }, props: true },
  { path: '/settings/expense-categories', name: 'expense-categories', component: () => import('../views/CategoryManageView.vue'), meta: { requiresAuth: true } },
  { path: '/settings/budget-categories', name: 'budget-categories', component: () => import('../views/CategoryManageView.vue'), meta: { requiresAuth: true } },
  { path: '/reports', name: 'reports', component: () => import('../views/ReportHistoryView.vue'), meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login' };
  }
  if (to.name === 'login' && auth.isLoggedIn) {
    return { name: 'dashboard' };
  }
});

export default router;
