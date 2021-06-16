import { useUser } from 'src/store/user';
import { createRouter, RouteRecordRaw, createWebHashHistory, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('src/pages/Landing.vue'),
  },
  {
    path: '/:id',
    name: 'Board',
    component: () => import('src/pages/Board.vue'),
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

Router.beforeEach((to, from, next) => {
  const { isLoggedIn } = useUser();
  if (to.path === '/') {
    if (isLoggedIn) {
      return next('/user');
    }
    return next();
  }

  if (!isLoggedIn) {
    return next('/');
  }

  next();
});
export { Router };
