import { ExpressionStatement, ImportDeclaration } from '@babel/types';
import { ParserOptions } from 'prettier';

import { IMPORT_ORDER_KEY } from './constants';

export interface ImportOrder {
  group: IMPORT_ORDER_KEY;
  condition?: (str: string) => boolean;
}

export interface PrettierOptions extends ParserOptions {
  importAliasRegExp: string;
  importPackageRegExp: string;
  importComponentRegExp: string;
  importStyleRegExp: string;
  importOrderSeparation: boolean;
  importOrderSortSpecifiers: boolean;
  importOrderParserPlugins: string[];
  importPackagesHeader: string[];
  importPackagesFooter: string[];
}

export type ImportOrLine = ImportDeclaration | ExpressionStatement;

export type ImportGroups = Record<string, ImportDeclaration[]>;
