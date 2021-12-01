import { ImportDeclaration } from '@babel/types';

import { naturalSort } from '../../utils/natural-sort';
import { getPathIndexByRegExpList, sortByReference, UN_FIND } from '../../utils/sort';

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
      ...sortByReference(first, headerRegExpList, ['source', 'value']),
      ...sortByReference(second, secondPathList, ['source', 'value']),
      ...sortByReference(third, footerRegExpList, ['source', 'value']),
    ];
  };
};
export const sortOthers: SortFunction = (nodes) => {
  const pathList = nodes.map((node) => node.source.value).sort((a, b) => naturalSort(a, b));
  return sortByReference(nodes, pathList, ['source', 'value']);
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
