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
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
      // Пример: маршрут только для неавторизованных пользователей
      beforeEnter: authGuards.requireNoAuth,
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/ProfilePage.vue'),
      // Пример: асинхронная проверка с обновлением токена
      beforeEnter: authGuards.asyncAuth,
    },
    {
      path: '/public',
      name: 'public',
      component: () => import('@/pages/PublicPage.vue'),
      // Пример: публичный маршрут, доступный всем
      beforeEnter: authGuards.optionalAuth,
    },
  ],
});
