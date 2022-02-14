import {
  isJSXAttribute,
  isJSXSpreadAttribute,
  JSXAttribute,
  JSXSpreadAttribute,
} from '@babel/types';
import { getPathIndexByRegExpList, sortByReference, UN_FIND } from '../../utils/sort';
import { isString } from 'lodash';
import { naturalSort } from '../../utils/natural-sort';
import { getStartKeyRegExpString } from '../../utils';

export const sortAttributes = (
  attributes: Array<JSXAttribute | JSXSpreadAttribute>,
  headerRegExpList: string[],
  footerRegExpList: string[]
) => {
  const spread: JSXSpreadAttribute[] = [];
  const nameSpaced: JSXAttribute[] = [];
  const first: JSXAttribute[] = [];
  const second: JSXAttribute[] = [];
  const third: JSXAttribute[] = [];

  attributes.forEach((attribute) => {
    if (isJSXSpreadAttribute(attribute)) {
      spread.push(attribute);
    }
    if (isJSXAttribute(attribute)) {
      const name = attribute.name.name;
      if (!isString(name)) {
        nameSpaced.push(attribute);
      } else if (getPathIndexByRegExpList(headerRegExpList, name) !== UN_FIND) {
        first.push(attribute);
      } else if (getPathIndexByRegExpList(footerRegExpList, name) !== UN_FIND) {
        third.push(attribute);
      } else {
        second.push(attribute);
      }
    }
  });

  const secondNameList = second
    .map((attribute) =>
      isString(attribute.name.name) ? attribute.name.name : attribute.name.name.name
    )
    .sort((a, b) => naturalSort(a, b))
    .map(getStartKeyRegExpString);

  return [
    ...spread,
    ...nameSpaced,
    ...sortByReference(first, headerRegExpList, ['name', 'name']),
    ...sortByReference(second, secondNameList as string[], ['name', 'name']),
    ...sortByReference(third, footerRegExpList, ['name', 'name']),
  ];
};
