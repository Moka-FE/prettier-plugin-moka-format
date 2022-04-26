import { ImportDeclaration } from '@babel/types';
import { AliasConfig } from '../../types';
import path, { join } from 'path';
import slash from 'slash';
import { getStartKeyRegExpString } from '../../utils';

const isRelativePath = (str: string) => /^\./.test(str);

const getBestAlias = (aliasConfigs: AliasConfig[], filePath: string) =>
  aliasConfigs.find(({ path: { absolute } }) => filePath.indexOf(absolute) >= 0);

const getRelativeToAlias = (
  node: ImportDeclaration,
  aliasConfigs: AliasConfig[],
  absoluteDir: string
) => {
  if (!isRelativePath(node.source.value)) {
    return node.source.value;
  }

  const absModulePath = join(absoluteDir, node.source.value);
  const aliasConfig = getBestAlias(aliasConfigs, absModulePath);

  if (!aliasConfig) {
    return node.source.value;
  }

  return slash(absModulePath.replace(aliasConfig.path.absolute, aliasConfig.alias));
};

const getAliasToRelative = ({
  node,
  aliasConfigs,
  absoluteDir,
}: {
  node: ImportDeclaration;
  aliasConfigs: AliasConfig[];
  absoluteDir: string;
}) => {
  if (isRelativePath(node.source.value)) {
    return node.source.value;
  }

  const replacedAliasConfig = aliasConfigs.find((config) =>
    new RegExp(getStartKeyRegExpString(config.alias)).test(node.source.value.trim())
  );

  if (!replacedAliasConfig) {
    return node.source.value;
  }

  const nodePath = node.source.value.trim();
  const nodeAbsPath = nodePath.replace(
    replacedAliasConfig.alias,
    replacedAliasConfig.path.absolute
  );

  let importRelativePath = path.relative(absoluteDir, nodeAbsPath);

  // 同层级相对路径 会丢失 ./  这里单独补全
  if (!new RegExp('^\\.').test(importRelativePath)) {
    importRelativePath = './' + importRelativePath;
  }

  return slash(importRelativePath);
};

const getRelativePathLevel = (str: string) => {
  return str.match(/((?<!\.)|(?<=\.{2}))\//g)?.length || 0;
};

const getAliasPathLevel = (str: string) => {
  return str.match(/(?<!@)\//g)?.length || 0;
};

const getLowLevelPath = (relativePath: string, aliasPath: string) => {
  return getRelativePathLevel(relativePath) < getAliasPathLevel(aliasPath)
    ? relativePath
    : aliasPath;
};

export const rewriteImport = (
  node: ImportDeclaration,
  aliasConfigs: AliasConfig[] = [],
  absoluteDir: string
): void => {
  if (!aliasConfigs.length) {
    return;
  }

  const aliasPath = getRelativeToAlias(node, aliasConfigs, absoluteDir);
  const relativePath = getAliasToRelative({
    node,
    aliasConfigs,
    absoluteDir,
  });

  // alias 优先于 相对路径
  node.source.value = getLowLevelPath(relativePath, aliasPath);
};
