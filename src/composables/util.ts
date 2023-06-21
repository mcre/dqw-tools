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

  return {
    numberArrayToBase64,
    base64ToNumberArray,
  };
};
