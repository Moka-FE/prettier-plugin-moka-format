import { parse as babelParser, ParserOptions } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { ImportDeclaration, isTSModuleDeclaration } from '@babel/types';

import { PrettierOptions } from '../types';
import { getCodeFromAst } from './get-code-from-ast';
import { getExperimentalParserPlugins } from './get-experimental-parser-plugins';
import { getSortedNodes } from './get-sorted-nodes';

export function sortImport(code: string, options: PrettierOptions) {
  const {
    importOrderSeparation,
    importOrderSortSpecifiers,
    importOrderParserPlugins,
    importAliasRegExp,
    importComponentRegExp,
    importPackageRegExp,
    importOtherRegExp,
    importPackagesHeader,
    importPackagesFooter,
    importIgnoreFilePath,
    filepath,
  } = options;

  if (importIgnoreFilePath.some((path) => path === filepath)) {
    return code;
  }

  const importNodes: ImportDeclaration[] = [];

  const parserOptions: ParserOptions = {
    sourceType: 'module',
    plugins: getExperimentalParserPlugins(importOrderParserPlugins),
  };

  const ast = babelParser(code, parserOptions);

  const interpreter = ast.program.interpreter;

  traverse(ast, {
    ImportDeclaration(path: NodePath<ImportDeclaration>) {
      const tsModuleParent = path.findParent((p) => isTSModuleDeclaration(p));
      if (!tsModuleParent) {
        importNodes.push(path.node);
      }
    },
  });

  if (importNodes.length === 0) return code;

  const allImports = getSortedNodes(importNodes, {
    importAliasRegExp,
    importComponentRegExp,
    importPackageRegExp,
    importOtherRegExp,
    importOrderSeparation,
    importOrderSortSpecifiers,
    importPackagesHeader,
    importPackagesFooter,
  });

  return getCodeFromAst(allImports, code, interpreter);
}
