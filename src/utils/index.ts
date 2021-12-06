import { File } from '@babel/types';
import generate from '@babel/generator';
import { newLineCharacters, PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE } from '../constants';
import { parse as babelParser, ParserOptions } from '@babel/parser';
import { getExperimentalParserPlugins } from './getExperimentalParserPlugins';

export const getPackageRegExpString = (name: string) => {
  return `^(${name}\\/)|^(${name})$`;
};
export const getCodeFromAst = (ast: File, retainLines = true) => {
  const { code } = generate(ast, {
    retainLines,
  });
  return code.replace(
    new RegExp(`"${PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE}";`, 'gi'),
    newLineCharacters
  );
};
export const createAst = (code: string, parserPlugins: string[]) => {
  const parserOptions: ParserOptions = {
    sourceType: 'module',
    plugins: getExperimentalParserPlugins(parserPlugins),
  };
  return babelParser(code, parserOptions);
};
