// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    children: [
      {
        path: "",
        name: "home",
        component: () =>
          import(/* webpackChunkName: "Home" */ "@/views/Home.vue"),
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
