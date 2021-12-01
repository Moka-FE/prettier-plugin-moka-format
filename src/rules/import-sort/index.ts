import { ImportDeclaration, isTSModuleDeclaration } from '@babel/types';
import { Rule } from '../../types';
import { getSortedNodes } from './getSortedNodes';

export const importSort: Rule['create'] = ({ options }) => {
  const {
    importOrderSeparation,
    importOrderSortSpecifiers,
    importAliasRegExpList,
    importComponentRegExp,
    importPackageRegExp,
    importOtherRegExp,
    importPackagesHeader,
    importPackagesFooter,
  } = options;

  const importNodes: ImportDeclaration[] = [];

  const allImports = getSortedNodes(importNodes, {
    importAliasRegExpList,
    importComponentRegExp,
    importPackageRegExp,
    importOtherRegExp,
    importOrderSeparation,
    importOrderSortSpecifiers,
    importPackagesHeader,
    importPackagesFooter,
  });

  return {
    ImportDeclaration: ({ path }) => {
      const tsModuleParent = path.findParent((p) => isTSModuleDeclaration(p));
      if (!tsModuleParent) {
        importNodes.push(path.node as ImportDeclaration);
        path.remove();
      }
    },
  };
};
