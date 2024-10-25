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

export const useKokorodoUtil = () => {
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

  return {
    kokoroColorCode,
    monsterFrequencyDetails,
    textToIcon,
  };
};
