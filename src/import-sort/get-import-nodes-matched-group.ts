import { ImportDeclaration } from '@babel/types';
import { THIRD_PARTY_MODULES_SPECIAL_WORD } from '../constants';
import { PrettierOptions } from '../types';

/**
 * Get the regexp group to keep the import nodes.
 * @param node
 * @param importOrder
 */
export const getImportNodesMatchedGroup = (
    node: ImportDeclaration,
    importOrder: PrettierOptions['importOrder'],
) => {
   if(importOrder){
       const groupWithRegExp = importOrder.map(({ group, condition }) => ({
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
