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

  return {
    numberArrayToBase64,
    base64ToNumberArray,
    kokoroColorCode,
  };
};
