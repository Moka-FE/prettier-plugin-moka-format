import { Plugin, SupportOptions } from 'prettier';
import { parsers as typescriptParsers } from 'prettier/parser-typescript';
import { parsers as babelParsers } from 'prettier/parser-babel';

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
};

export const plugin: Plugin = {
  parsers: {
      babel: {
          ...babelParsers.babel,
          preprocess: sortImport,
      },
    typescript: {
      ...typescriptParsers.typescript,
      preprocess: sortImport,
    },
    css: {
      ...postcssParsers.css,
    },
  },
  options,
};
