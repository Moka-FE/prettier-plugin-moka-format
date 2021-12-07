import { File } from '@babel/types';
import { newLineCharacters, PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE } from '../constants';
import { parse as babelParser, ParserOptions } from '@babel/parser';
import { getExperimentalParserPlugins } from './getExperimentalParserPlugins';
import { parse, print } from 'recast-yx';
import generate from '@babel/generator';

export const getPackageRegExpString = (name: string) => {
  return `^(${name}\\/)|^(${name})$`;
};
export const getCodeFromAst = (ast: File, keepFormat = true) => {
  const { code } = keepFormat ? print(ast) : generate(ast);
  return code.replace(
    new RegExp(`"${PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE}";`, 'gi'),
    newLineCharacters
  );
};
export const createAst = (code: string, parserPlugins: string[]) => {
  const parserOptions: ParserOptions = {
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    allowAwaitOutsideFunction: true,
    allowUndeclaredExports: true,
    allowSuperOutsideMethod: true,
    startLine: 1,
    tokens: true,
    sourceType: 'module',
    plugins: getExperimentalParserPlugins(parserPlugins),
  };
  return parse(code, {
    parser: {
      parse(code: string) {
        try {
          return babelParser(code, parserOptions);
        } catch (e) {
          throw Error(e.message);
        }
      },
    },
  });
};
