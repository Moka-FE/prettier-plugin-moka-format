import { NodePath, Visitor } from '@babel/traverse';
import { ExpressionStatement, File, ImportDeclaration } from '@babel/types';
import { ParserOptions } from 'prettier';

import { IMPORT_ORDER_KEY } from './constants';
import { Emitter } from './emitter';

export interface ImportOrder {
  group: IMPORT_ORDER_KEY;
  condition?: (str: string) => boolean;
}
export interface PrettierOptions extends ParserOptions {
  // enable rule list
  configuredRules: string[]; // babel rules
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
export type TraverseRuleParams = {
  ast: File;
  path: NodePath;
  originalCode: string;
  options: PrettierOptions;
  emitter: Emitter;
  state?: unknown;
};
export type LifeCycleRuleParams = {
  ast: File;
  emitter: Emitter;
  originalCode: string;
  options: PrettierOptions;
};
export type RuleParams = TraverseRuleParams | LifeCycleRuleParams;

export type Listener<T = RuleParams> = (params: T) => void;

export type TraverseHookMap = { [key in EventName]: Listener<TraverseRuleParams> };
export type OtherHookMap = {
  [key: string]: Listener<LifeCycleRuleParams>;
};
export type CreateTraverseHookMapParams = {
  emitter: Emitter;
  options: PrettierOptions;
  originalCode: string;
  ast: File;
};
export enum HOOK_TYPE {
  TRAVERSER_HOOK = 'traverseHook',
  CYCLE_HOOK = 'cycleHook',
}
export type RuleCreateMap = {
  [HOOK_TYPE.TRAVERSER_HOOK]?: TraverseHookMap;
  [HOOK_TYPE.CYCLE_HOOK]?: OtherHookMap;
};
export type Rule = {
  create: (params: CreateTraverseHookMapParams) => RuleCreateMap;
};
