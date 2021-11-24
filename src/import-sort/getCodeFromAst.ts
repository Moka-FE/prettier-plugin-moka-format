import generate from '@babel/generator';
import { InterpreterDirective, Statement, file } from '@babel/types';

import { newLineCharacters } from '../constants';
import { getAllCommentsFromNodes } from './getAllCommentsFromNodes';
import { removeNodesFromOriginalCode } from './removeNodesFromOriginalCode';

/**
 * This function generate a code string from the passed nodes.
 * @param nodes all imports
 * @param originalCode
 * @param interpreter
 */
export const getCodeFromAst = (
  nodes: Statement[],
  originalCode: string,
  interpreter?: InterpreterDirective | null
) => {
  const allCommentsFromImports = getAllCommentsFromNodes(nodes);

  const nodesToRemoveFromCode = [
    ...nodes,
    ...allCommentsFromImports,
    ...(interpreter ? [interpreter] : []),
  ];

  const codeWithoutImportsAndInterpreter = removeNodesFromOriginalCode(
    originalCode,
    nodesToRemoveFromCode
  );

  const newAST = file({
    type: 'Program',
    body: nodes,
    directives: [],
    sourceType: 'module',
    interpreter: interpreter,
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
  });

  const { code } = generate(newAST);

  return (
    code.replace(/"PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE";/gi, newLineCharacters) +
    codeWithoutImportsAndInterpreter.trim()
  );
};
