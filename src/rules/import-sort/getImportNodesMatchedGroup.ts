import { ImportDeclaration } from '@babel/types';

import { THIRD_PARTY_MODULES_SPECIAL_WORD } from '../../constants';
import { ImportOrder } from '../../types';

/**
 * Get the regexp group to keep the import nodes.
 * @param node
 * @param importOrderList
 */
export const getImportNodesMatchedGroup = (
  node: ImportDeclaration,
  importOrderList: ImportOrder[]
) => {
  if (importOrderList) {
    const groupWithRegExp = importOrderList.map(({ group, condition }) => ({
      group,
      condition,
    }));

    for (const { group, condition } of groupWithRegExp) {
      const matched = condition && condition(node.source.value);
      if (matched) return group;
    }
  }

  return THIRD_PARTY_MODULES_SPECIAL_WORD;
};
