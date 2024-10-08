import { RouterOptions } from "vite-ssg";
import Index from "@/pages/index.vue";
import NotFound from "@/pages/not-found.vue";

export type ToolParams = {
  title: string;
  subtitle: string;
  path: string;
  description: string;
};

export type Tool = {
  component: Component;
  params: ToolParams;
};

type Tools = {
  [key: string]: Tool;
};

import Kokorodo from "@/pages/kokorodo.vue";
import AverageLevel from "@/pages/average-level.vue";

export const tools: Tools = {
  kokorodo: {
    component: Kokorodo,
    params: {
      title: "こころ道",
      subtitle: "周回クエスト検索ツール",
      path: "/kokorodo",
      description:
        "ほしいこころ道の枠を選択することで、入手可能なこころの数が多い順でクエストが表示されます。",
    },
  },
  "average-level": {
    component: AverageLevel,
    params: {
      title: "メタルキャンペーン",
      subtitle: "平均レベル計算ツール",
      path: "/average-level",
      description:
        "メンバー4人分のレベルを選択することにより、平均レベルが計算されます。メタルキャンペーン（メタルの群れ）の場合にどのメタルが出現するかも併せて表示されます。",
    },
  },
};

export const routerOptions: RouterOptions = {
  routes: [
    { path: "/", name: "index", component: Index },
    ...Object.keys(tools).map((key) => ({
      path: tools[key].params.path,
      name: key,
      component: tools[key].component,
    })),
    {
      path: "/:pathMatch(.*)*",
      component: NotFound,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      nextTick(() => {
        if (to.hash) {
          resolve({ el: to.hash });
        } else if (from.path != to.path) {
          return { top: 0 };
        }
      });
    });
  },
};
