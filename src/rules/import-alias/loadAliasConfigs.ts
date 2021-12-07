import { sync as findUpSync } from 'find-up';
import { ConfigLoaderResult, ConfigLoaderSuccessResult, loadConfig } from 'tsconfig-paths';
import { dirname, join } from 'path';
import micromatch from 'micromatch';
import { AliasConfig } from '../../types';

const isConfigLoaderSuccessResult = (
  configLoaderResult: ConfigLoaderResult
): configLoaderResult is ConfigLoaderSuccessResult => configLoaderResult.resultType === 'success';

export const loadAliasConfigs = (filepath: string) => {
  const configFilePath = findUpSync(['tsconfig.json', 'jsconfig.json'].filter(Boolean), {
    cwd: filepath, // works as dir
  });

  if (!configFilePath) {
    return [];
  }

  const config = loadConfig(configFilePath);

  if (!isConfigLoaderSuccessResult(config)) {
    return [];
  }

  const configDir = dirname(configFilePath);
  const absoluteRootDir = join(configDir, config.baseUrl);

  return Object.entries(config.paths).reduce((configs, [aliasGlob, aliasPaths]) => {
    aliasPaths.forEach((aliasPath) => {
      const relativePathBase = micromatch.scan(aliasPath).base;
      configs.push({
        alias: micromatch.scan(aliasGlob).base,
        path: {
          absolute: join(absoluteRootDir, relativePathBase),
        },
      });
    });
    return configs;
  }, [] as AliasConfig[]);
};
