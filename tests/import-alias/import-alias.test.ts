import { readFileSync } from 'fs';
import { resolve } from 'path';
import { format } from 'prettier';
import { merge } from 'lodash';
import { PrettierOptions } from '../../src/types';
import * as plugin from '../../src';
import { prettierOption } from '../common';

describe('import alias', () => {
  test('import alias substitution', () => {
    const code: string = readFileSync(
      resolve(__dirname, './alias-substitution/unformatted.ts'),
      'utf8'
    );
    const expected: string = readFileSync(
      resolve(__dirname, './alias-substitution/formatted.ts'),
      'utf8'
    );
    const actual: string = format(
      code,
      merge(prettierOption, {
        parser: 'typescript',
        plugins: [plugin],
        configuredRules: ['importAlias'],
        filepath: 'tests/import-alias/alias-substitution/unformatted.ts',
      }) as PrettierOptions
    );

    expect(actual).toBe(expected);
  });
});
