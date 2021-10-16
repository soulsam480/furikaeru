import { getToken } from 'src/utils/helpers';
import { createRouter, RouteRecordRaw, createWebHashHistory, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('src/pages/Landing.vue'),
  },
  {
    path: '/:id',
    name: 'PublicBoard',
    component: () => import('src/pages/Board.vue'),
  },
  {
    path: '/board/:id',
    name: 'Board',
    component: () => import('src/pages/PrivateBoard.vue'),
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('src/pages/User.vue'),
  },
];

const Router = createRouter({
  routes,
  history: import.meta.env.PROD ? createWebHistory() : createWebHashHistory(),
});

Router.beforeEach((to, _, next) => {
  if (to.name === 'PublicBoard') return next();

  if (['Landing'].includes(to.name as string)) {
    if (!!getToken()) return next('/user');

    return next();
  }

  if (!getToken()) {
    return next('/');
  }

  next();
});

export { Router };
