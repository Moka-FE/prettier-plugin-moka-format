import { readFileSync } from 'fs';
import { resolve } from 'path';
import { format } from 'prettier';
import { merge } from 'lodash';
import { PrettierOptions } from '../../src/types';
import * as plugin from '../../src';
import { prettierOption } from '../common';

describe('import sort', () => {
  test('import order sort', () => {
    const code: string = readFileSync(resolve(__dirname, './order-sort/unformatted.ts'), 'utf8');
    const expected: string = readFileSync(resolve(__dirname, './order-sort/formatted.ts'), 'utf8');
    const actual: string = format(
      code,
      merge(prettierOption, {
        parser: 'typescript',
        plugins: [plugin],
        configuredRules: ['importSort'],
        importOrderSeparation: false,
        importOrderSortSpecifiers: false,
      }) as PrettierOptions
    );

    expect(actual).toBe(expected);
  });

  test('import order separation', () => {
    const code: string = readFileSync(
      resolve(__dirname, './import-separation/unformatted.ts'),
      'utf8'
    );
    const expected: string = readFileSync(
      resolve(__dirname, './import-separation/formatted.ts'),
      'utf8'
    );
    const actual: string = format(
      code,
      merge(prettierOption, {
        parser: 'typescript',
        plugins: [plugin],
        configuredRules: ['importSort'],

        importOrderSeparation: true,
        importOrderSortSpecifiers: false,
      }) as PrettierOptions
    );

    expect(actual).toBe(expected);
  });

  test('specifiers sort', () => {
    const code: string = readFileSync(
      resolve(__dirname, './specifiers-sort/unformatted.ts'),
      'utf8'
    );
    const expected: string = readFileSync(
      resolve(__dirname, './specifiers-sort/formatted.ts'),
      'utf8'
    );
    const actual: string = format(
      code,
      merge(prettierOption, {
        parser: 'typescript',
        plugins: [plugin],
        configuredRules: ['importSort'],
        importOrderSeparation: false,
        importOrderSortSpecifiers: true,
      }) as PrettierOptions
    );

    expect(actual).toBe(expected);
  });
});
