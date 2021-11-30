import { ExpressionStatement, File, ImportDeclaration } from '@babel/types';
import { ParserOptions } from 'prettier';

import { IMPORT_ORDER_KEY } from './constants';
import { Emitter } from './emitter';
import { NodePath, Visitor } from '@babel/traverse';

export interface ImportOrder {
  group: IMPORT_ORDER_KEY;
  condition?: (str: string) => boolean;
}

export interface PrettierOptions extends ParserOptions {
  // enable rule list
  configuredRules: string[];
  // babel rules
  parserPlugins: string[];
  importAliasRegExpList: string[];
  importPackageRegExp: string;
  importComponentRegExp: string;
  importOtherRegExp: string;
  importOrderSeparation: boolean;
  importOrderSortSpecifiers: boolean;
  importPackagesHeader: string[];
  importPackagesFooter: string[];
}

export type ImportOrLine = ImportDeclaration | ExpressionStatement;

export type ImportGroups = Record<string, ImportDeclaration[]>;

export type EventName = keyof Visitor | string;

export type RuleParams = {
  ast: File;
  path: NodePath;
  originalCode: string;
  options: PrettierOptions;
  emitter: Emitter;
  state?: { [key: string]: any };
};

export type EffectForTraverse = (params: RuleParams) => void;

export type TraverseHookMap = {
  [key in EventName]: EffectForTraverse;
};

export type CreateTraverseHookMapParams = {
  emitter: Emitter;
  options: PrettierOptions;
  originalCode: string;
  ast: File;
};

export type Rule = {
  create: (params: CreateTraverseHookMapParams) => TraverseHookMap;
};
