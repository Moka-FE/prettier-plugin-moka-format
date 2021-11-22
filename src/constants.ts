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
  STYLES = 'styles',
}

export const REGS = {
  ALIAS: '^(@moka-fe|@components)',
  PACKAGE: '^([a-z]|@)(.+)$',
  COMPONENT: '([A-Z](\\w+))$',
  STYLES: '(.styl|.css)$',
};

const getPackageRegExpString = (name: string) => {
  return `^(${name}\\/)|^(${name})$`;
};

export const PACKAGES_HEADER = [
  getPackageRegExpString('react-hot-loader'),
  getPackageRegExpString('react'),
  getPackageRegExpString('react-dom'),
  getPackageRegExpString('redux'),
  getPackageRegExpString('react-redux'),
  getPackageRegExpString('prop-types'),
  getPackageRegExpString('react-router'),
  getPackageRegExpString('react-router-dom'),
  getPackageRegExpString('mage-react-router'),
];
export const PACKAGES_FOOTER = [
  getPackageRegExpString('moka-ui'),
  getPackageRegExpString('sugar-design'),
  getPackageRegExpString('@SDFoundation'),
  getPackageRegExpString('@SDV'),
  getPackageRegExpString('@@cms'),
];
