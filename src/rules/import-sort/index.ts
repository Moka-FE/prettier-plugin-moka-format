import { NodePath } from '@babel/traverse';
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
  const importPath: NodePath[] = [];
  return {
    traverseHook: {
      ImportDeclaration: ({ path }) => {
        const tsModuleParent = path.findParent((p) => isTSModuleDeclaration(p));

        if (!tsModuleParent) {
          importPath.push(path);
          importNodes.push(path.node as ImportDeclaration);
        }
      },
    },
    cycleHook: {
      TraverseEnd: ({ ast, originalCode }) => {
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
        ast.program.body.unshift(...allImports);
        importPath.forEach((path) => path.remove());
      },
    },
  };
};
export default {
  create: importSort,
};
