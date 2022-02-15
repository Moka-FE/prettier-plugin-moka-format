import { expressionStatement, stringLiteral } from '@babel/types';
import { getStartKeyRegExpString } from './utils';

export const newLineCharacters = '\n\n';
/*
 * Used to mark the position between RegExps,
 * where the not matched imports should be placed
 */

export const THIRD_PARTY_MODULES_SPECIAL_WORD = 'utils';
export const PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE = 'PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE';
export const newLineNode = expressionStatement(
  stringLiteral(PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE)
);
export enum IMPORT_ORDER_KEY {
  PACKAGES = 'packages',
  COMPONENTS = 'components',
  UTILS = 'utils',
  OTHERS = 'others',
}

export const REGS = {
  ALIAS: [
    {
      value: ['^@/'],
    },
  ],
  PACKAGE: '^([a-z]|@)(.+)$',
  COMPONENT: '/([A-Z](\\w+))$',
  OTHERS: '((\\.)\\w+)$',
};

export const PACKAGES_HEADER = [
  'react-hot-loader',
  'react',
  'react-dom',
  'redux',
  'react-redux',
  'prop-types',
  'react-router',
  'react-router-dom',
  'mage-react-router',
].map(getStartKeyRegExpString);
export const PACKAGES_FOOTER = ['moka-ui', 'sugar-design', '@SDFoundation', '@SDV', '@cms'].map(
  getStartKeyRegExpString
);
export const PARSER_PLUGINS = ['typescript', 'jsx'];

export const JSX_ATTRIBUTE_HEADER = [].map(getStartKeyRegExpString);
export const JSX_ATTRIBUTE_FOOTER = [].map(getStartKeyRegExpString);
