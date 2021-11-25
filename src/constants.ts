import { expressionStatement, stringLiteral } from '@babel/types';

export const newLineCharacters = '\n\n';

/*
 * Used to mark the position between RegExps,
 * where the not matched imports should be placed
 */
export const THIRD_PARTY_MODULES_SPECIAL_WORD = 'utils';

const PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE = 'PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE';

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
  ALIAS: '^@/',
  PACKAGE: '^([a-z]|@)(.+)$',
  COMPONENT: '/([A-Z](\\w+))$',
  OTHERS: '((\\.)\\w+)$',
};

const getPackageRegExpString = (name: string) => {
  return `^(${name}\\/)|^(${name})$`;
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
].map((name) => getPackageRegExpString(name));

export const PACKAGES_FOOTER = ['moka-ui', 'sugar-design', '@SDFoundation', '@SDV', '@cms'].map(
  (name) => getPackageRegExpString(name)
);
