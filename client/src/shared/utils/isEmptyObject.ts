export const isEmptyObject = (obj: object): boolean => {
  if (obj === null || obj === undefined) return true;
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};
