import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { authGuard } from "@auth0/auth0-vue";
import homeRoutes from "@/modules/home/router";
import adminstrationRoutes from "@/modules/administration/router";
import authenticationRoutes from "@/modules/authentication/router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    children: [
      {
        path: "",
        component: () => import("@/views/Default.vue"),
      },
      ...authenticationRoutes,
      ...homeRoutes,
      ...adminstrationRoutes,

      {
        path: "*",
        component: () => import("@/views/NotFound.vue"),
      },
    ],
  },
];

import { useUserStore } from "@/store/UserStore";

export async function waitForUserToLoad(): Promise<any> {
  let u = useUserStore();
  await u.initialize();
  return u;
}

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  console.log("BEFORE", to.meta.requiresAuth, to.meta.requireSystemAdmin);

  if (to.meta.requiresAuth === false) {
    console.log("route allowed - no auth required");
    return true;
  }

  console.log("Await authGuard");
  const isAuthenticated = await authGuard(to);

  if (isAuthenticated) {
    console.log("You are authenticated");

    if (to.meta.requireSystemAdmin) {
      const u = await waitForUserToLoad();
      console.log("User Is Admin", u.isAdmin);
      return u.isAdmin;
    }

    console.log(" route allowed");
    return true;
  }

  console.log("You are NOT authenticated - route blocked");
  return false;
});
