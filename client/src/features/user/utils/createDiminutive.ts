export const createDiminutive = (fullName: string) => {
  if (!fullName) return '';
  // Convert to string in a word array
  const words = fullName.split(' ');
  // Create a diminutive by taking the first letter of each word
  const dm = words.map((word) => word.charAt(0).toUpperCase()).join('');
  return dm.length < 2 ? dm : dm[0] + dm[1];
};
