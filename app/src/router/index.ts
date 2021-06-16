import { createRouter, RouteRecordRaw, createWebHashHistory, createWebHistory } from 'vue-router';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('src/pages/Landing.vue'),
  },
];

export const Router = createRouter({
  routes,
  history: import.meta.env.PROD ? createWebHistory() : createWebHashHistory(),
});
