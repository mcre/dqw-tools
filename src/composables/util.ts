import {
  mdiHexagonOutline,
  mdiHexagonSlice1,
  mdiHexagonSlice2,
  mdiHexagonSlice3,
  mdiHexagonSlice4,
  mdiHexagonSlice5,
  mdiWater,
  mdiMap,
  mdiHelp,
  mdiWeatherNight,
} from "@mdi/js";

import { useHead } from "@unhead/vue";
import { ToolParams } from "@/router/index";

export const useUtil = () => {
  const numberArrayToBase64 = (selectedNumbers: number[]): string => {
    const max = Math.max(...selectedNumbers);
    if (max < 0) return "";
    const bytes = new Array(Math.ceil(max / 8)).fill(0);

    for (const box of selectedNumbers) {
      const byteIndex = Math.floor(box / 8);
      const bitIndex = box % 8;
      bytes[byteIndex] |= 1 << bitIndex;
    }

    let binary = "";
    const bytesLen = bytes.length;

    for (let i = 0; i < bytesLen; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  };

  const base64ToNumberArray = (str: string): number[] => {
    const binary = atob(str);
    const bytes = [];

    for (let i = 0; i < binary.length; i++) {
      bytes.push(binary.charCodeAt(i));
    }

    const selectedNumbers = [];
    for (let i = 0; i < bytes.length; i++) {
      for (let j = 0; j < 8; j++) {
        if (bytes[i] & (1 << j)) {
          selectedNumbers.push(i * 8 + j);
        }
      }
    }
    return selectedNumbers;
  };

  const kokoroColorCode = (colorName: string): string => {
    switch (colorName) {
      case "青":
        return "rgb(52, 113, 210)";
      case "紫":
        return "rgb(140, 43, 195)";
      case "黄":
        return "rgb(210, 193, 75)";
      case "緑":
        return "rgb(75, 166, 75)";
      case "赤":
        return "rgb(232, 63, 53)";
      default:
        return "rgb(0, 0, 0)";
    }
  };

  const monsterFrequencyDetails = (
    frequencyKey: string,
  ): { level: number; icon: string; text: string } => {
    switch (frequencyKey) {
      case "とても":
        return {
          level: 5,
          icon: mdiHexagonSlice5,
          text: "とてもよく見かける",
        };
      case "よく":
        return { level: 4, icon: mdiHexagonSlice4, text: "よく見かける" };
      case "ときどき":
        return {
          level: 3,
          icon: mdiHexagonSlice3,
          text: "ときどき見かける",
        };
      case "あまり":
        return {
          level: 2,
          icon: mdiHexagonSlice2,
          text: "あまり見かけない",
        };
      case "めったに":
        return {
          level: 1,
          icon: mdiHexagonSlice1,
          text: "めったに見かけない",
        };
      default:
        return {
          level: 0,
          icon: mdiHexagonOutline,
          text: "その他",
        };
    }
  };

  const textToIcon = (text: string): string => {
    switch (text) {
      case "水":
        return mdiWater;
      case "地域":
        return mdiMap;
      case "夜":
        return mdiWeatherNight;
      default:
        return mdiHelp;
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const setToolTitle = (toolParams?: ToolParams) => {
    const site = import.meta.env.VITE_APP_TITLE;

    let path: string;
    let title: string;
    let description: string;

    if (toolParams) {
      path = toolParams.path;
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

    const distUrl = `https://${import.meta.env.VITE_DISTRIBUTION_DOMAIN_NAME}`;
    useHead({
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
          content: `${distUrl}${path}`,
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
    });
  };

  const updateOgp = (toolParams: ToolParams) => {
    const distUrl = `https://${import.meta.env.VITE_DISTRIBUTION_DOMAIN_NAME}`;

    let currentUrl = `${distUrl}${toolParams.path}`;
    if (!import.meta.env.SSR) currentUrl = document.documentURI;

    useHead({
      meta: [
        {
          id: "og-url",
          content: currentUrl,
        },
      ],
    });
  };

  return {
    numberArrayToBase64,
    base64ToNumberArray,
    kokoroColorCode,
    monsterFrequencyDetails,
    textToIcon,
    copyToClipboard,
    setToolTitle,
    updateOgp,
  };
};
