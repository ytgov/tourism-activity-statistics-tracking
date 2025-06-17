import { authGuard } from "@auth0/auth0-vue";

const routes = [
  {
    path: "",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "/administration",
        component: () => import("../views/Administration.vue"),
        beforeEnter: authGuard,
        meta: { requiresAuth: true, requireSystemAdmin: true },
      },
      {
        path: "/administration/users",
        component: () => import("../views/UserList.vue"),
        beforeEnter: authGuard,
        meta: { requiresAuth: true, requireSystemAdmin: true },
      },
      {
        path: "/administration/visitor-centres",
        component: () => import("../views/CentreList.vue"),
        beforeEnter: authGuard,
        meta: { requiresAuth: true, requireSystemAdmin: true },
      },
      {
        path: "/administration/kiosks",
        component: () => import("../views/KioskData.vue"),
        beforeEnter: authGuard,
        meta: { requiresAuth: true, requireSystemAdmin: true },
      },
    ],
  },
];

export default routes;
