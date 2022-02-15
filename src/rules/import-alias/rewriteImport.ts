import { ImportDeclaration } from '@babel/types';
import { AliasConfig } from '../../types';
import path, { join } from 'path';
import slash from 'slash';
import { getStartKeyRegExpString } from '../../utils';

const getBestAlias = (aliasConfigs: AliasConfig[], filePath: string) =>
  aliasConfigs.find(({ path: { absolute } }) => filePath.indexOf(absolute) >= 0);

const rewriteRelativeToAlias = (
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

const rewriteAliasToRelative = ({
  node,
  replacedAliasConfig,
  absoluteDir,
  conditionRegExp,
}: {
  node: ImportDeclaration;
  replacedAliasConfig: AliasConfig;
  absoluteDir: string;
  conditionRegExp: RegExp;
}) => {
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

  if (!conditionRegExp.test(importRelativePath)) {
    node.source.value = slash(importRelativePath);
  }
};

export const rewriteImport = (
  node: ImportDeclaration,
  aliasConfigs: AliasConfig[],
  absoluteDir: string,
  levelCondition: number
): void => {
  if (!aliasConfigs?.length) {
    return;
  }

  const regExp = new RegExp('(\\.\\./)' + `{${levelCondition}}`);

  if (regExp.test(node.source.value.trim())) {
    rewriteRelativeToAlias(node, aliasConfigs, absoluteDir);
  }

  const replacedAliasConfig = aliasConfigs.find((config) =>
    new RegExp(getStartKeyRegExpString(config.alias)).test(node.source.value.trim())
  );
  if (replacedAliasConfig) {
    rewriteAliasToRelative({
      node,
      replacedAliasConfig,
      absoluteDir,
      conditionRegExp: regExp,
    });
  }
};
