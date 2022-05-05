# Prettier Plugin Moka Format

> 提示： 需要项目安装 prettier 2.x 以上版本方可使用

## Install

npm

```shell script
npm install --save-dev prettier-plugin-moka-format
```

or, using yarn

```shell script
yarn add --dev prettier-plugin-moka-format
```

## Usage

最简单的开始方式

```ecmascript 6
module.exports = {
  "configuredRules":["importSort","importAlias","jsxAttributesSort"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

## Base Rules

### `configuredRules`

type: `string[]`

default value: `[]`

```json
 "configuredRules":["importSort","importAlias","jsxAttributesSort"]
```

desc: 启用的规则,详细规则参考下方规则说明

### `parserPlugins`

type: `string[]`

default value: `['typescript', 'jsx']`

desc: `babel parser`的`plugin`

```json
"parserPlugins" : ["typescript", "jsx"]
```

## Rules of JavaScript

1. [ImportSort](#ImportSort)
2. [ImportAlias](#ImportAlias)
3. [JsxAttributesSort](#JsxAttributesSort)

## ImportSort

用来排序 import statement 的规则 ，有以下属性
  - [ImportSort](#importsort)
    - [ImportOrderSeparation](#importorderseparation)
    - [ImportPackageRegExp](#importpackageregexp)
    - [ImportComponentRegExp](#importcomponentregexp)
    - [ImportOtherRegExp](#importotherregexp)
    - [~~ImportAliasRegExpList~~](#importaliasregexplist)
    - [ImportPackagesHeader](#importpackagesheader)
    - [ImportPackagesFooter](#importpackagesfooter)
    - [ImportOrderSortSpecifiers](#importordersortspecifiers)
    - [ImportSortIgnorePathRegExpList](#importsortignorepathregexplist)
  - [ImportAlias](#importalias)
  - [JSXAttributesSort](#jsxattributessort)
    - [JSXAttributesHeader](#jsxattributesheader)
    - [JSXAttributesFooter](#jsxattributesfooter)

### ImportOrderSeparation

> **import 分为固定 4 组 以 `packages、components、utils、others`** **的顺序排序**
>
> 前三种通过正则匹配 path 判断 import 属于哪个分组
>
> 匹配不到的统一归为 utils
> 如果有本地 alias ，可以配置`importAliasRegExpList`来避免被归为 packages (**如果开启了`importAlias`** 则无需`importAliasRegExpList`，此属性后期考虑去除，通过读取`tsconfig`识别)
>
> 如果要覆盖 `importAliasRegExpList` 之类的配置，一定注意不要写成 `@` 这种，这个是正则匹配，写成 `@` 会导致 路径上所有 带 `@` 的都会被识别到， 例如 `@lingui`

type: `boolean`

default value: `false`

```js
module.exports = {
  configuredRules: ['importSort'],
  importOrderSeparation: true,
};
```

desc: 排序分组之后的 import 之间 增加一行空行

### ImportPackageRegExp

type: `string`

default value: `^([a-z]|@)(.+)$`

desc： 用于匹配 `packages` 的正则

### ImportComponentRegExp

type : `string`

default value: `/([A-Z](\w+))$`

desc： 用于匹配 `component` 的正则

### ImportOtherRegExp

type : `string`

default value: `((\\.)\\w+)$`

desc： 用于匹配 非 js 文件 的正则

### ~~ImportAliasRegExpList~~

type : `string[]`

default value : `['^@/'] `

> NOTE: 以下的 package regExp 都为此格式 ^(${name}\\/)|^(${name})$
>
> 用于 对 packages 组内部排序 header | other | footer
>
> 没有匹配到的会被放入 other

### ImportPackagesHeader

type: `string[]`

default :

```javascript
[
  'react-hot-loader',
  'react',
  'react-dom',
  'redux',
  'react-redux',
  'prop-types',
  'react-router',
  'react-router-dom',
  'mage-react-router',
];
```

desc: `packages`头部属性顺序，会被排在最前面

### ImportPackagesFooter

type: `string[]`

default:

```javascript
['moka-ui', 'sugar-design', '@SDFoundation', '@SDV', '@cms'];
```

desc: `packages`尾部属性顺序，会被排在最后面

### ImportOrderSortSpecifiers

type: `boolean`

default value: false

```js
module.exports = {
  configuredRules: ['importSort'],
  importOrderSortSpecifiers: true,
};
```

```js
// before
import { b, a } from 'xx';

// after
import { a, b } from 'xx';
```

desc: 对 import 导入的 标识符 sort

### ImportSortIgnorePathRegExpList

type: `string[]`

default value: `[]`

desc: 用来忽略`importSort`的正则数组, 一般是对 import 顺序有需求开启，例如样式引入顺序

```js
module.exports = {
  configuredRules: ['importSort'],
  importSortIgnorePathRegExpList: ['src/main-app/index.js', 'src/main-app/vendor.js'],
};
```

## ImportAlias

用于将相对路径替换为别名的 format

```javascript
// before
import { REGS } from '../../../src/constants';
import { Button, Dropdown, Icon, Tooltip } from 'sugar-design';
import * as sdf from '@SDFoundation';
import Avatar from '../common/Avatar';
import { ContainerLoading } from '../common/ContainerLoading';

// after
import { REGS } from '@/constants';
import { Button, Dropdown, Icon, Tooltip } from 'sugar-design';
import * as sdf from '@SDFoundation';
import Avatar from '../common/Avatar';
import { ContainerLoading } from '../common/ContainerLoading';
```

desc: 相对路径替换别名的层级条件，根据 `/` 计算层级判断使用相对路径还是别名，同层级下优先别名

## JSXAttributesSort

jsx attributes 排序

- [jsxAttributesHeader](#JSXAttributesHeader)
- [jsxAttributesFooter](#JSXAttributesFooter)

> JSX Attributes Sort 也分为 上中下 三组，分别是 `Header` `Other` `Footer`
> 匹配不到的属性都会丢进 `Other` 中按 ascii 顺序排列

### JSXAttributesHeader

type: `string[]`

default: `[]`

desc: `Header` 的 order 正则数组

### JSXAttributesFooter

type: `string[]`

default: `[]`

desc: `Footer` 的 order 正则数组
