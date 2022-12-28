import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import homeRoutes from "@/modules/home/router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    children: [...homeRoutes],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
