export const useUtil = () => {
  const consts = {
    host: "https://dqw.mcre.info",
  };

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
    frequencyKey: string
  ): { level: number; icon: string; text: string } => {
    switch (frequencyKey) {
      case "とても":
        return {
          level: 5,
          icon: "mdi-hexagon-slice-5",
          text: "とてもよく見かける",
        };
      case "よく":
        return { level: 4, icon: "mdi-hexagon-slice-4", text: "よく見かける" };
      case "ときどき":
        return {
          level: 3,
          icon: "mdi-hexagon-slice-3",
          text: "ときどき見かける",
        };
      case "あまり":
        return {
          level: 2,
          icon: "mdi-hexagon-slice-2",
          text: "あまり見かけない",
        };
      case "めったに":
        return {
          level: 1,
          icon: "mdi-hexagon-slice-1",
          text: "めったに見かけない",
        };
      default:
        return {
          level: 0,
          icon: "mdi-hexagon-slice-0",
          text: "その他",
        };
    }
  };

  const textToIcon = (text: string): string => {
    switch (text) {
      case "水":
        return "mdi-water";
      case "地域":
        return "mdi-map";
      case "夜":
        return "mdi-weather-night";
      default:
        return "mdi-help";
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const setTitle = (title?: string | null) => {
    const site = "DQW Tools";
    let newTitle = "";
    if (title) {
      newTitle = title + " - " + site;
    } else {
      newTitle = site;
    }
    document.title = newTitle;

    const elem1 = document.querySelector("meta[id='ogtitle']");
    if (elem1) elem1.setAttribute("content", newTitle);

    const elem3 = document.querySelector("meta[id='ogurl']");
    if (elem3) elem3.setAttribute("content", document.documentURI);
  };

  return {
    consts,
    numberArrayToBase64,
    base64ToNumberArray,
    kokoroColorCode,
    monsterFrequencyDetails,
    textToIcon,
    copyToClipboard,
    setTitle,
  };
};
