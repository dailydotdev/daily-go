import Vue from 'vue';
import Router from 'vue-router';
import loadStateGuard from './guards/loadState';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/toilet',
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
      children: [
        {
          path: '/toilet',
          component: () => import(/* webpackChunkName: "toilet" */ '../views/Toilet.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    },
    {
      path: '/oauth/:provider/callback',
      name: 'oauth',
      component: () => import(/* webpackChunkName: "oauth" */ '../views/OAuth.vue'),
    },
    {
      path: '/notSupported',
      name: 'notSupported',
      component: () => import(/* webpackChunkName: "notSupported" */ '../views/NotSupported.vue'),
    },
    {
      path: '*',
      name: 'notFound',
      component: () => import(/* webpackChunkName: "notFound" */ '../views/NotFound.vue'),
    },
  ],
});

router.beforeEach(loadStateGuard);

export default router;
