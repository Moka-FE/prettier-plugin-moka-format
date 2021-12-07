import { ImportDeclaration } from '@babel/types';
import { AliasConfig } from '../../types';
import { join } from 'path';
import slash from 'slash';

const getBestAlias = (aliasConfigs: AliasConfig[], filePath: string) =>
  aliasConfigs.find(({ path: { absolute } }) => filePath.indexOf(absolute) >= 0);

const rewriteRelativePath = (
  node: ImportDeclaration,
  aliasConfigs: AliasConfig[],
  absoluteDir: string
) => {
  const absModulePath = join(absoluteDir, node.source.value);
  const aliasConfig = getBestAlias(aliasConfigs, absModulePath);

  if (aliasConfig) {
    node.source.value = slash(absModulePath.replace(aliasConfig.path.absolute, aliasConfig.alias));
  }
};

export const rewriteImport = (
  node: ImportDeclaration,
  aliasConfigs: AliasConfig[],
  absoluteDir: string,
  levelCondition: number
): void => {
  const regExp = new RegExp('(\\.\\./)' + `{${levelCondition}}`);
  if (regExp.test(node.source.value.trim())) {
    rewriteRelativePath(node, aliasConfigs, absoluteDir);
  }
};
