import { parse as babelParser, ParserOptions } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { ImportDeclaration, isTSModuleDeclaration } from '@babel/types';

import { DEFAULT_IMPORT_ORDER } from '../constants';
import { PrettierOptions } from '../types';
import { getCodeFromAst } from './get-code-from-ast';
import { getExperimentalParserPlugins } from './get-experimental-parser-plugins';
import { getSortedNodes } from './get-sorted-nodes';

export function sortImport(code: string, options: PrettierOptions) {
  const {
    importOrder = DEFAULT_IMPORT_ORDER,
    importOrderSeparation,
    importOrderSortSpecifiers,
    importOrderParserPlugins,
  } = options;

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
    importOrder,
    importOrderSeparation,
    importOrderSortSpecifiers,
  });

  return getCodeFromAst(allImports, code, interpreter);
}
