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

  const setTitle = (
    title?: string | null,
    description: string = "DQW(ドラゴンクエストウォーク)のプレイに役立つツール集。こころ道周回クエスト検索ツールなど。",
    robots: boolean = true
  ) => {
    const site = import.meta.env.VITE_APP_TITLE;
    let newTitle = "";
    if (title) {
      newTitle = title + " - " + site;
    } else {
      newTitle = site;
    }
    document.title = newTitle;

    const robotsMeta = document.querySelector("meta[id='robots']");
    if (robotsMeta) {
      if (robots) {
        robotsMeta.setAttribute("content", "all");
      } else {
        robotsMeta.setAttribute("content", "noindex, nofollow, noarchive");
      }
    }

    const metaDescription = document.querySelector("meta[id='description']");
    if (metaDescription) metaDescription.setAttribute("content", description);

    const ogURl = document.querySelector("meta[id='og-url']");
    if (ogURl) ogURl.setAttribute("content", document.documentURI);

    const ogTitle = document.querySelector("meta[id='og-title']");
    if (ogTitle)
      if (title) ogTitle.setAttribute("content", title);
      else ogTitle.setAttribute("content", site);

    const ogDescription = document.querySelector("meta[id='og-description']");
    if (ogDescription) ogDescription.setAttribute("content", description);

    const imageFullPath = `https://${
      import.meta.env.VITE_DISTRIBUTION_DOMAIN_NAME
    }/img/kokorodo-sample.png`;

    const ogImage = document.querySelector("meta[id='og-image']");
    if (ogImage) ogImage.setAttribute("content", imageFullPath);

    const twImage = document.querySelector("meta[id='tw-image']");
    if (twImage) twImage.setAttribute("content", imageFullPath);
  };

  const updateOgp = () => {
    const ogURl = document.querySelector("meta[id='og-url']");
    if (ogURl) ogURl.setAttribute("content", document.documentURI);
  };

  return {
    numberArrayToBase64,
    base64ToNumberArray,
    kokoroColorCode,
    monsterFrequencyDetails,
    textToIcon,
    copyToClipboard,
    setTitle,
    updateOgp,
  };
};
