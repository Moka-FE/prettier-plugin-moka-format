import { clone, isEqual } from 'lodash';
import {  ImportOrLine, ImportGroups, PrettierOptions } from '../types';
import {
    IMPORT_ORDER_KEY,
    newLineNode,
} from '../constants';
import { getImportNodesMatchedGroup } from './get-import-nodes-matched-group';
import { getSortedImportSpecifiers, sortOthers, sortPackages } from './sort';
import { addComments, ImportDeclaration, removeComments } from '@babel/types';


type GetSortedNodes = (
    nodes: ImportDeclaration[],
    options: Required<Pick<
        PrettierOptions,
        'importOrder' | 'importOrderSeparation' | 'importOrderSortSpecifiers'
        >>
) => ImportOrLine[];

export const getSortedNodes: GetSortedNodes = (nodes, options) => {
    const {
        importOrderSeparation ,
        importOrderSortSpecifiers,
        importOrder
    } = options;

    const originalNodes = nodes.map(clone);
    const finalNodes: ImportOrLine[] = [];

    const importOrderGroups = importOrder.reduce<ImportGroups>(
        (groups, { group }) => ({
            ...groups,
            [group]: [],
        }),
        {},
    );

    for (const node of originalNodes) {
        const matchedGroup = getImportNodesMatchedGroup(node, importOrder);
        importOrderGroups[matchedGroup].push(node);
    }

    const sortByGroup = {
        [IMPORT_ORDER_KEY.PACKAGES]: sortPackages,
        [IMPORT_ORDER_KEY.COMPONENTS]: sortOthers,
        [IMPORT_ORDER_KEY.UTILS]: sortOthers,
        [IMPORT_ORDER_KEY.STYLES]: sortOthers,
    };

    for (const { group } of importOrder) {
        const groupNodes = importOrderGroups[group];

        if (groupNodes.length === 0) continue;

        const sortedInsideGroup = sortByGroup[group](groupNodes);

        // Sort the import specifiers
        if (importOrderSortSpecifiers) {
            sortedInsideGroup.forEach((node) =>
                getSortedImportSpecifiers(node),
            );
        }

        finalNodes.push(...sortedInsideGroup);

        if (importOrderSeparation) {
            finalNodes.push(newLineNode);
        }
    }

    if (finalNodes.length > 0 && !importOrderSeparation) {
        // a newline after all imports
        finalNodes.push(newLineNode);
    }

    // maintain a copy of the nodes to extract comments from
    const finalNodesClone = finalNodes.map(clone);

    const firstNodesComments = nodes[0].leadingComments;

    // Remove all comments from sorted nodes
    finalNodes.forEach(removeComments);

    // insert comments other than the first comments
    finalNodes.forEach((node, index) => {
        if (isEqual(nodes[0].loc, node.loc)) return;

        addComments(
            node,
            'leading',
            finalNodesClone[index].leadingComments || [],
        );
    });

    if (firstNodesComments) {
        addComments(finalNodes[0], 'leading', firstNodesComments);
    }

    return finalNodes;
};
