import { Rule } from '../../types';
import { ImportDeclaration, isTSModuleDeclaration } from '@babel/types';
import { loadAliasConfigs } from './loadAliasConfigs';
import { dirname, resolve } from 'path';
import { rewriteImport } from './rewriteImport';

export const importAliasCreate: Rule['create'] = ({ options }) => {
  const { filepath } = options;

  const aliasConfigs = loadAliasConfigs(filepath);

  const importNodes: ImportDeclaration[] = [];

  return {
    traverseHook: {
      ImportDeclaration: ({ path }) => {
        const tsModuleParent = path.findParent((p) => isTSModuleDeclaration(p));

        if (!tsModuleParent) {
          importNodes.push(path.node as ImportDeclaration);
        }
      },
    },
    cycleHook: {
      TraverseEnd: () => {
        if (!importNodes.length || !aliasConfigs.length) {
          return;
        }

        const currentFileAbsDir = dirname(resolve(filepath));
        importNodes.forEach((node) => rewriteImport(node, aliasConfigs, currentFileAbsDir));
      },
    },
  };
};

export const importAliasRule: Rule = {
  create: importAliasCreate,
};
