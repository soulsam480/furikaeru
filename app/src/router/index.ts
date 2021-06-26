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

Router.beforeEach((to, from, next) => {
  const { isLoggedIn } = useUser();

  if (to.name === 'PublicBoard') return next();

  if (['Landing'].includes(to.name as string)) {
    if (isLoggedIn.value) {
      return next('/user');
    }
    return next();
  }

  if (!isLoggedIn.value) {
    return next('/');
  }

  next();
});
export { Router };
