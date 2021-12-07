import { SupportOptions } from 'prettier';
import { parsers as babelParsers } from 'prettier/parser-babel';
import { parsers as typescriptParsers } from 'prettier/parser-typescript';

import {
  PACKAGES_FOOTER,
  PACKAGES_HEADER,
  PARSER_PLUGINS,
  REGS,
  ALIAS_CONVERSION_LEVEL,
  JSX_ATTRIBUTE_HEADER,
  JSX_ATTRIBUTE_FOOTER,
} from './constants';
import { preprocess } from './preprocess';

const options: SupportOptions = {
  // base attribute
  configuredRules: {
    since: '1.0.0',
    type: 'path',
    array: true,
    default: [
      {
        value: [],
      },
    ],
    category: 'Global',
    description: 'enable rule list',
  },
  parserPlugins: {
    since: '1.0.0',
    type: 'path',
    category: 'Global',
    array: true,
    default: [
      {
        value: PARSER_PLUGINS,
      },
    ],
    description: 'Provide a list of rules for special syntax',
  },
  jsxAttributesHeader: {
    since: '1.0.3',
    type: 'path',
    array: true,
    default: [
      {
        value: JSX_ATTRIBUTE_HEADER,
      },
    ],
    category: 'Global',
    description: 'jsx attributes header order',
  },
  jsxAttributesFooter: {
    since: '1.0.3',
    type: 'path',
    array: true,
    default: [
      {
        value: JSX_ATTRIBUTE_FOOTER,
      },
    ],
    category: 'Global',
    description: 'jsx attributes footer order',
  },

  importAliasConversionLevel: {
    since: '1.0.3',
    type: 'path',
    array: false,
    default: ALIAS_CONVERSION_LEVEL,
    category: 'Global',
    description: 'conditions for converting relative paths to aliases',
  },
  // importSort attributes
  importPackagesHeader: {
    since: '0.0.6',
    type: 'path',
    array: true,
    category: 'Global',
    default: [
      {
        value: PACKAGES_HEADER,
      },
    ],
    description: 'package header order',
  },
  importPackagesFooter: {
    since: '0.0.6',
    type: 'path',
    array: true,
    category: 'Global',
    default: [
      {
        value: PACKAGES_FOOTER,
      },
    ],
    description: 'package footer order',
  },
  importAliasRegExpList: {
    since: '0.1.6',
    type: 'path',
    array: true,
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
  importOtherRegExp: {
    since: '0.0.6',
    type: 'path',
    array: false,
    category: 'Global',
    default: REGS.OTHERS,
    description: 'Regex to match import others',
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
  importSortIgnorePathRegExpList: {
    since: '1.0.3',
    type: 'path',
    array: true,
    category: 'Global',
    default: [
      {
        value: [],
      },
    ],
    description: 'import sort ignore path list',
  },
};
module.exports = {
  parsers: {
    babel: { ...babelParsers.babel, preprocess },
    typescript: { ...typescriptParsers.typescript, preprocess },
  },
  options,
};
