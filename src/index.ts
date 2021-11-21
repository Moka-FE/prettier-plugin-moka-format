import { Parser, Plugin, SupportOptions } from 'prettier';
import { parsers as babelParsers } from 'prettier/parser-babel';
import { parsers as typescriptParsers } from 'prettier/parser-typescript';

import { sortImport } from './import-sort';

import { parsers as postcssParsers } from 'prettier/parser-postcss';

const options: SupportOptions = {
  importOrder: {
    since: '0.0.1',
    type: 'path',
    category: 'Global',
    array: true,
    default: undefined,
    description: 'Provide an order to sort imports.',
  },
  importOrderSeparation: {
    since: '0.0.1',
    type: 'boolean',
    category: 'Global',
    default: false,
    description: 'Should imports be separated by new line?',
  },
  importOrderSortSpecifiers: {
    since: '0.0.1',
    type: 'boolean',
    category: 'Global',
    default: false,
    description: 'Should specifiers be sorted?',
  },
  importOrderParserPlugins: {
    since: '0.0.3',
    type: 'path',
    category: 'Global',
    array: true,
    // By default, we add ts and jsx as parsers but if users define something
    // we take that option
    default: [{ value: ['typescript', 'jsx'] }],
    description: 'Provide a list of plugins for special syntax',
  },
};

export const plugin: Plugin = {
  parsers: {
    babel: {
      ...babelParsers.babel,
      preprocess: sortImport as Parser['preprocess'],
    },
    typescript: {
      ...typescriptParsers.typescript,
      preprocess: sortImport as Parser['preprocess'],
    },
    css: {
      ...postcssParsers.css,
    },
  },
  options,
};
