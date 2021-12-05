export const getPackageRegExpString = (name: string) => {
  return `^(${name}\\/)|^(${name})$`;
};
