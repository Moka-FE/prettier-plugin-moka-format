import { sortBy } from 'lodash';

export const UN_FIND = 9999;

export const getPathIndexByRegExpList = (regExpList: string[], path: string): number => {
  const index = regExpList.findIndex((regExp) => {
    return new RegExp(regExp).test(path);
  });
  return index === -1 ? UN_FIND : index;
};

export const sortByReference = <T>(arr: T[], reference: string[], keyPath: string[]): T[] => {
  return sortBy(arr, (item) => {
    // @ts-ignore
    const path: string = keyPath.reduce((acc, cur) => {
      // @ts-ignore
      return acc[cur];
    }, item);
    return getPathIndexByRegExpList(reference, path);
  });
};
