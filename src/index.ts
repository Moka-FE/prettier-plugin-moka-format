import { Parser, SupportOptions } from 'prettier';
import { parsers as babelParsers } from 'prettier/parser-babel';
import { parsers as typescriptParsers } from 'prettier/parser-typescript';

import { sortImport } from './import-sort';
import { PACKAGES_FOOTER, PACKAGES_HEADER, REGS } from './constants';

const options: SupportOptions = {
  importPackagesHeader: {
    since: '0.0.6',
    type: 'path',
    array: true,
    category: 'Global',
    default: [{ value: PACKAGES_HEADER }],
    description: 'package header order',
  },
  importPackagesFooter: {
    since: '0.0.6',
    type: 'path',
    array: true,
    category: 'Global',
    default: [{ value: PACKAGES_FOOTER }],
    description: 'package footer order',
  },
  importAliasRegExp: {
    since: '0.0.6',
    type: 'path',
    array: false,
    category: 'Global',
    default: REGS.ALIAS,
    description: 'Regex to match import alias',
  },
  importPackageRegExp: {
    since: '0.0.6',
    type: 'path',
    array: false,
    category: 'Global',
    default: REGS.PACKAGE,
    description: 'Regex to match import packages',
  },
  importComponentRegExp: {
    since: '0.0.6',
    type: 'path',
    array: false,
    category: 'Global',
    default: REGS.COMPONENT,
    description: 'Regex to match import component',
  },
  importStyleRegExp: {
    since: '0.0.6',
    type: 'path',
    array: false,
    category: 'Global',
    default: REGS.STYLES,
    description: 'Regex to match import style',
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

module.exports = {
  parsers: {
    babel: {
      ...babelParsers.babel,
      preprocess: sortImport as Parser['preprocess'],
    },
    typescript: {
      ...typescriptParsers.typescript,
      preprocess: sortImport as Parser['preprocess'],
    },
  },
  options,
};
