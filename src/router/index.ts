// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "Home",
        redirect: { name: "kokorodo" },
      },
      {
        path: "kokorodo",
        name: "kokorodo",
        component: () =>
          import(/* webpackChunkName: "Kokorodo" */ "@/views/Kokorodo.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
