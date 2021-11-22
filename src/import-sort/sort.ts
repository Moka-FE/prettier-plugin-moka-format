import { ImportDeclaration } from '@babel/types';
import { naturalSort } from '../natural-sort';
import { sortBy } from 'lodash';

const UN_FIND = 9999;

const getPathIndexByRegExpList = (regExpList: string[], path: string): number => {
  const index = regExpList.findIndex((regExp) => {
    return new RegExp(regExp).test(path);
  });
  return index === -1 ? UN_FIND : index;
};

const sortByReference = (arr: ImportDeclaration[], reference: string[]): ImportDeclaration[] => {
  return sortBy(arr, (a) => {
    return getPathIndexByRegExpList(reference, a.source.value);
  });
};

type SortFunction = (nodes: ImportDeclaration[]) => ImportDeclaration[];

export const createSortPackages = (
  headerRegExpList: string[],
  footerRegExpList: string[]
): SortFunction => {
  return (nodes: ImportDeclaration[]) => {
    const first: ImportDeclaration[] = [];
    const second: ImportDeclaration[] = [];
    const third: ImportDeclaration[] = [];

    nodes.forEach((node) => {
      const pack = node.source.value;
      if (getPathIndexByRegExpList(headerRegExpList, pack) !== UN_FIND) {
        first.push(node);
      } else if (getPathIndexByRegExpList(footerRegExpList, pack) !== UN_FIND) {
        third.push(node);
      } else {
        second.push(node);
      }
    });

    const secondPathList = second.map((node) => node.source.value).sort();
    return [
      ...sortByReference(first, headerRegExpList),
      ...sortByReference(second, secondPathList),
      ...sortByReference(third, footerRegExpList),
    ];
  };
};

export const sortOthers: SortFunction = (nodes) => {
  const pathList = nodes.map((node) => node.source.value).sort((a, b) => naturalSort(a, b));
  return sortByReference(nodes, pathList);
};

export const getSortedImportSpecifiers = (node: ImportDeclaration) => {
  node.specifiers.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'ImportDefaultSpecifier' ? -1 : 1;
    }

    return naturalSort(a.local.name, b.local.name);
  });
  return node;
};
