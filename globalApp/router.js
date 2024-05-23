import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{
    path: '/global',
    name: 'globalIndex',
    component: () => import(/* webpackChunkName: "globalIndex" */'@/pages/global/index.vue'),
    meta: { title: 'domestic' },
  },{
    path: '/common',
    name: 'CommonIndex',
    component: () => import(/* webpackChunkName: "CommonIndex" */'@/pages/common/index.vue'),
    meta: { title: 'common' },
  }],
  strict: false, //
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

router.beforeEach(async (to, from, next) => {
  next();
});

router.onError(error => {
  console.warn('router error', error.message);
});

export default router;

