import { readFileSync } from 'fs';
import { resolve } from 'path';
import { format } from 'prettier';
import { merge } from 'lodash';
import { PrettierOptions } from '../../src/types';
import * as plugin from '../../src';
import { prettierOption } from '../common';

describe('jsx attributes sort', () => {
  test(' attributes order sort', () => {
    const code: string = readFileSync(
      resolve(__dirname, './order-sort/unformatted.tsx'),
      'utf8'
    );
    const expected: string = readFileSync(
      resolve(__dirname, './order-sort/formatted.tsx'),
      'utf8'
    );
    const actual: string = format(
      code,
      merge(prettierOption, {
        parser: 'typescript',
        plugins: [plugin],
        configuredRules: ['jsxAttributesSort'],
      }) as PrettierOptions
    );

    expect(actual).toBe(expected);
  });
});
