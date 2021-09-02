export const zeroPad = (num, places) => String(num).padStart(places, "0");

export const htmlDecode = (string) => {
  const doc = new DOMParser().parseFromString(string, "text/html");
  return doc.documentElement.textContent;
};
