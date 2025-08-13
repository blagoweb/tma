import { createRouter, createWebHistory } from 'vue-router';
import { authGuards } from '../middleware/auth';
import IndexPage from '@/pages/IndexPage.vue';

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexPage,
      // Пример: защищенный маршрут, требующий авторизации
      beforeEnter: authGuards.requireAuth,
    },
  ],
});
