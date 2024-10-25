import { ToolParams } from "@/router/index";

export const useHeaderUtil = () => {
  const getHead = (toolParams?: ToolParams) => {
    const site = import.meta.env.VITE_APP_TITLE;
    const distUrl = `https://${import.meta.env.VITE_DISTRIBUTION_DOMAIN_NAME}`;

    const route = useRoute();
    let path: string;
    let title: string;
    let description: string;

    const currentFullPath = computed(() => `${distUrl}${route.fullPath}`);

    if (toolParams) {
      title = toolParams.title + " - " + site;
      description = toolParams.description;
    } else {
      path = "/";
      title = site;
      description =
        "ドラゴンクエストウォーク)のプレイに役立つツール集。こころ道周回クエスト検索ツールなど。";
    }

    const imageFullPath = `https://${
      import.meta.env.VITE_DISTRIBUTION_DOMAIN_NAME
    }/img/kokorodo-sample.png`;

    return {
      title: title,
      meta: [
        {
          id: "robots",
          content: "all",
        },
        {
          id: "description",
          content: description,
        },
        {
          id: "og-title",
          content: title,
        },
        {
          id: "og-url",
          content: currentFullPath,
        },
        {
          id: "og-image",
          content: imageFullPath,
        },
        {
          id: "og-description",
          content: description,
        },
        {
          id: "tw-image",
          content: imageFullPath,
        },
      ],
    };
  };

  return {
    getHead,
  };
};
