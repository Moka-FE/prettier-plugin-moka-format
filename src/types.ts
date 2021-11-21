import { ParserOptions } from 'prettier';
import { ExpressionStatement, ImportDeclaration } from '@babel/types';
import { IMPORT_ORDER_KEY } from './constants';

export interface ImportOrder {
    group: IMPORT_ORDER_KEY;
    condition?: (str: string) => boolean;
}

export interface PrettierOptions extends ParserOptions {
    importOrder: ImportOrder[];
    importOrderSeparation: boolean;
    importOrderSortSpecifiers: boolean;
}

export type ImportOrLine = ImportDeclaration | ExpressionStatement;

export type ImportGroups = Record<string, ImportDeclaration[]>;


