import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import homeRoutes from "@/modules/home/router";
import adminstrationRoutes from "@/modules/administration/router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    children: [...homeRoutes, ...adminstrationRoutes],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
