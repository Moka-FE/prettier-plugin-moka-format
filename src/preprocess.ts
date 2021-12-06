import traverse, { NodePath } from '@babel/traverse';
import { File } from '@babel/types';
import createEmitter, { Emitter } from './emitter';
import { importSortRule } from './rules/import-sort';
import {
  CreateTraverseHookMapParams,
  EventName,
  HOOK_TYPE,
  Listener,
  PrettierOptions,
  Rule,
  RuleCreateMap,
} from './types';
import { importAliasRule } from './rules/import-alias';
import { jsxAttributeSortRule } from './rules/jsx-attributes-sort';
import { createAst, getCodeFromAst } from './utils';

type SelectorFn = (path: NodePath) => void;
type VisitorOption = { [key in EventName]: SelectorFn };

const createRuleListeners = (rule: Rule, ruleContext: CreateTraverseHookMapParams) => {
  return rule.create(ruleContext);
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
  return (path: NodePath, state?: unknown) => {
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
    importSort: importSortRule,
    importAlias: importAliasRule,
    jsxAttributesSort: jsxAttributeSortRule,
  };

  // 这里有顺序要求，importAlias 必须在importSort前面
  const enableRules = [
    {
      key: 'importAlias',
      enabled: false,
    },
    {
      key: 'importSort',
      enabled: false,
    },
    {
      key: 'jsxAttributesSort',
      enabled: false,
    },
  ].filter((item) => {
    return configuredRules.find((ruleKey) => ruleKey === item.key);
  });

  const emitter = createEmitter();
  const ast = createAst(code, parserPlugins);
  const visitorKeys: string[] = [];

  enableRules.forEach(({ key }) => {
    const rule = ruleMap[key];
    if (rule) {
      const ruleContext = {
        ast,
        options,
        emitter,
        originalCode: code,
      };
      const hookMap = createRuleListeners(rule, ruleContext);
      Object.keys(hookMap).forEach((scenesKey) => {
        const scenes = hookMap[scenesKey as keyof RuleCreateMap];
        if (scenes) {
          Object.keys(scenes).forEach((visitorKey) => {
            if (scenesKey === HOOK_TYPE.TRAVERSER_HOOK) {
              visitorKeys.push(visitorKey);
            }

            emitter.on(visitorKey, scenes[visitorKey] as Listener);
          });
        }
      });
    }
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
