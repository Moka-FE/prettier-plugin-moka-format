import { ImportDeclaration } from '@babel/types';
import { naturalSort } from '../natural-sort';

const sortByReference = (arr: ImportDeclaration[], reference: string[]) => {
    arr.sort((a, b) => {
        return (
            reference.indexOf(a.source.value) -
            reference.indexOf(b.source.value)
        );
    });
    return arr;
};

type SortFunction = (nodes: ImportDeclaration[]) => any[];

export const sortPackages: SortFunction = (nodes) => {
    const HEADER = [
        'react-hot-loader',
        'react-hot-loader/root',
        'react',
        'react-dom',
        'redux',
        'react-redux',
        'prop-types',
        'react-router',
        'react-router-dom',
        'mage-react-router',
    ];
    const FOOTER = ['moka-ui', 'sugar-design', '@SDFoundation', '@SDV', '@cms'];

    const first: ImportDeclaration[] = [];
    const second: ImportDeclaration[] = [];
    const third: ImportDeclaration[] = [];

    nodes.forEach((node) => {
        const pack = node.source.value;
        if (HEADER.includes(pack)) {
            first.push(node);
        } else if (FOOTER.includes(pack)) {
            third.push(node);
        } else {
            second.push(node);
        }
    });

    const secondPathList = second.map((node) => node.source.value).sort();

    return [
        ...sortByReference(first, HEADER),
        ...sortByReference(second, secondPathList),
        ...sortByReference(third, FOOTER),
    ];
};

export const sortOthers: SortFunction = (nodes) => {
    const pathList = nodes.map((node) => node.source.value).sort(
        (a,b)=> naturalSort(a,b)
    );
    return sortByReference(nodes, pathList);
};

export const getSortedImportSpecifiers = (node: ImportDeclaration) => {
    node.specifiers.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === 'ImportDefaultSpecifier' ? -1 : 1;
        }

        return naturalSort(a.local.name, b.local.name);
    });
    return node;
};
