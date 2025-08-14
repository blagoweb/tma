import { createRouter, createWebHistory } from 'vue-router';
import IndexPage from "@/pages/IndexPage.vue";

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexPage,
    },
  ],
});
