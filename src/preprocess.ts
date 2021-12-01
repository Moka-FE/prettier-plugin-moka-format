import generate from '@babel/generator';
import { ParserOptions, parse as babelParser } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { File } from '@babel/types';

import { PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE, newLineCharacters } from './constants';
import createEmitter, { Emitter } from './emitter';
import importSort from './rules/import-sort';
import {
  CreateTraverseHookMapParams,
  EventName,
  HOOK_TYPE,
  Listener,
  PrettierOptions,
  Rule,
  RuleCreateMap,
} from './types';
import { getExperimentalParserPlugins } from './utils/getExperimentalParserPlugins';

type SelectorFn = (path: NodePath) => void;
type VisitorOption = { [key in EventName]: SelectorFn };

const createRuleListeners = (rule: Rule, ruleContext: CreateTraverseHookMapParams) => {
  return rule.create(ruleContext);
};

const createAst = (code: string, parserPlugins: string[]) => {
  const parserOptions: ParserOptions = {
    sourceType: 'module',
    plugins: getExperimentalParserPlugins(parserPlugins),
  };
  return babelParser(code, parserOptions);
};

const getCodeFromAst = (ast: File) => {
  const { code } = generate(ast);
  return code.replace(
    new RegExp(`"${PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE}";`, 'gi'),
    newLineCharacters
  );
};

const createSelectorFn = ({
  emitter,
  visitorKey,
  options,
  originalCode,
  ast,
}: {
  emitter: Emitter;
  visitorKey: string;
  originalCode: string;
  options: PrettierOptions;
  ast: File;
}): SelectorFn => {
  return (path: NodePath, state?: any) => {
    emitter.emit(visitorKey, {
      path,
      originalCode,
      options,
      state,
      ast,
      emitter,
    });
  };
};

export const preprocess = (code: string, options: PrettierOptions) => {
  const { configuredRules, parserPlugins } = options;
  const ruleMap: {
    [key: string]: Rule;
  } = {
    importSort: importSort,
  };
  const emitter = createEmitter();
  const ast = createAst(code, parserPlugins);
  const visitorKeys: string[] = [];
  configuredRules.forEach((ruleKey) => {
    const rule = ruleMap[ruleKey];
    const ruleContext = {
      ast,
      options,
      emitter,
      originalCode: code,
    };
    const hookMap = createRuleListeners(rule, ruleContext);
    Object.keys(hookMap).forEach((scenesKey) => {
      const scenes = hookMap[scenesKey as keyof RuleCreateMap];
      Object.keys(scenes).forEach((visitorKey) => {
        if (scenesKey === HOOK_TYPE.TRAVERSER_HOOK) {
          visitorKeys.push(visitorKey);
        }

        emitter.on(visitorKey, scenes[visitorKey] as Listener);
      });
    });
  });
  const traverseOption: VisitorOption = visitorKeys.reduce((pre, visitorKey) => {
    pre[visitorKey] = createSelectorFn({
      emitter,
      visitorKey,
      options,
      originalCode: code,
      ast,
    });
    return pre;
  }, {} as VisitorOption);
  traverse(ast, traverseOption);
  emitter.emit('TraverseEnd', {
    emitter,
    ast,
    originalCode: code,
    options,
  });
  return getCodeFromAst(ast);
};
