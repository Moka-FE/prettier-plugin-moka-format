import { CreateTraverseHookMapParams, EventName, PrettierOptions, Rule } from './types';
import createEmitter, { Emitter } from './emitter';
import { parse as babelParser, ParserOptions } from '@babel/parser';
import { getExperimentalParserPlugins } from './import-sort/getExperimentalParserPlugins';
import traverse, { NodePath } from '@babel/traverse';
import { File } from '@babel/types';
import generate from '@babel/generator';
import { newLineCharacters } from './constants';

type SelectorFn = (path: NodePath) => void;

type VisitorOption = {
  [key in EventName]: SelectorFn;
};

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
  return code.replace(/"PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE";/gi, newLineCharacters);
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
  const ruleMap: { [key: string]: Rule } = {};
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

    const traverseHookMap = createRuleListeners(rule, ruleContext);

    Object.keys(traverseHookMap).forEach((visitorKey) => {
      visitorKeys.push(visitorKey);
      emitter.on(visitorKey, traverseHookMap[visitorKey as EventName]);
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

  return getCodeFromAst(ast);
};
