export const getStorageData = (key) => {
  const data = JSON.parse(localStorage.getItem(key));
  return data;
};

export const saveDataToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
