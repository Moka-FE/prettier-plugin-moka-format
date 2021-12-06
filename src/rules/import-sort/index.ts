import { NodePath } from '@babel/traverse';
import { file, ImportDeclaration, isTSModuleDeclaration } from '@babel/types';

import { Rule } from '../../types';
import { getSortedNodes } from './getSortedNodes';
import { createAst, getCodeFromAst } from '../../utils';
import { getAllCommentsFromNodes } from './getAllCommentsFromNodes';
import { removeCommentsFromAst } from './removeCommentsFromAst';
import { newLineNode } from '../../constants';

const importSortCreate: Rule['create'] = ({ options }) => {
  const {
    importOrderSeparation,
    importOrderSortSpecifiers,
    importAliasRegExpList,
    importComponentRegExp,
    importPackageRegExp,
    importOtherRegExp,
    importPackagesHeader,
    importPackagesFooter,
    filepath,
    importSortIgnorePathRegExpList,
  } = options;

  if (importSortIgnorePathRegExpList?.some((regExp) => new RegExp(regExp).test(filepath))) {
    return {};
  }

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
      TraverseEnd: ({ ast, options }) => {
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

        const newAllImportsAst = createAst(
          getCodeFromAst(
            file({
              type: 'Program',
              body: allImports,
              directives: [],
              sourceType: 'module',
              interpreter: ast.program.interpreter,
              sourceFile: '',
              leadingComments: [],
              innerComments: [],
              trailingComments: [],
              start: 0,
              end: 0,
              loc: {
                start: { line: 0, column: 0 },
                end: { line: 0, column: 0 },
              },
            }),
            false
          ),
          options.parserPlugins
        );

        const newAllImports = newAllImportsAst.program.body;

        removeCommentsFromAst(ast, getAllCommentsFromNodes(allImports));

        ast.program.body.unshift(...newAllImports, newLineNode);
        ast.comments?.push(...(newAllImportsAst.comments || []));
        importPath.forEach((path) => path.remove());
      },
    },
  };
};

export const importSortRule: Rule = {
  create: importSortCreate,
};
