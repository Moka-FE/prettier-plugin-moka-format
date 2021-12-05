import { Rule } from '../../types';
import { JSXOpeningElement } from '@babel/types';
import { sortAttributes } from './sortAttributes';

export const jsxAttributeSortCreate: Rule['create'] = ({ options }) => {
  const { jsxAttributesHeader, jsxAttributesFooter } = options;

  return {
    traverseHook: {
      JSXOpeningElement: ({ path }) => {
        const node = path.node as JSXOpeningElement;
        node.attributes = sortAttributes(node.attributes, jsxAttributesHeader, jsxAttributesFooter);
      },
    },
  };
};

export const jsxAttributeSortRule: Rule = {
  create: jsxAttributeSortCreate,
};
