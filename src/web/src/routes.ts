import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/test",
    name: "TestRoute",
    component: () => import('./views/Test.vue'),
    meta: {
      layout: 'default-layout'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
