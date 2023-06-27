// Composables
import { createRouter, createWebHistory } from "vue-router";
import { trackRouter } from "vue-gtag-next";

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

if (process.env.NODE_ENV === "production") {
  trackRouter(router);
}

export default router;
