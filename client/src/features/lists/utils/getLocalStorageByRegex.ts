export const getLocalStorageByRegex = (regex: RegExp) => {
  const keys = Object.keys(localStorage);
  const matchingKey = keys.find((key) => regex.test(key));

  if (matchingKey) {
    return localStorage.getItem(matchingKey);
  }
  return null;
};
