# Prettier plugin moka format

#### Install

npm

```shell script
npm install --save-dev prettier-plugin-moka-format
```

or, using yarn

```shell script
yarn add --dev prettier-plugin-moka-format
```


#### Usage

最简单的开始方式

```ecmascript 6
module.exports = {
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

# API

#### `configuredRules` 

type: `string[]`

default value: `[]`

```json
"configuredRules" : ['importSort',"importAlias"]
```

desc: 启用的规则

#### `parserPlugins` 

type: `string[]`

default value: `['typescript', 'jsx']`

desc: babel parser的plugin

```json
"parserPlugins" : ['typescript', 'jsx']
```


#### `importSortIgnorePathRegExpList` 

type: `string[]`

default value: `undefined`

desc: 用来忽略`importSort`的正则数组


#### `importOrderSeparation` 

type: `boolean`

default value: `false`

```json
"importOrderSeparation" : true
```

desc: 排序分组之后的 import 之间 增加一行空行



#### `importOrderSortSpecifiers`

type: `boolean`

default value: false

```json
"importOrderSortSpecifiers":true		
```


```js
// before
import { b, a } from 'xx' 

// after
import { a, b } from 'xx'
```
desc: 对 imoprt 导入的 标识符 sort



### 此处为分组相关api 

> **import 分为固定4组 `packages、components、others、 utils`**
>
> 前三种通过正则匹配path判断import属于哪个分组 
>
> 匹配不到的统一归为 utils 
>
> 如果有本地alias ，可以配置`importAliasRegExpList`来避免被归为 packages
> 
> 如果要覆盖 `importAliasRegExpList` 之类的配置，一定注意不要写成 `@` 这种，这个是正则匹配，写成 `@` 会导致 路径上所有 带 `@` 的都会被识别到， 例如 `@lingui`



#### `importAliasRegExpList`

type : `string[]`

default value : `['^@/'] `



#### `importPackageRegExp`

type: `string`

default value: `^([a-z]|@)(.+)$`



#### `importComponentRegExp`

type : `string`

default value: `/([A-Z](\w+))$`



#### `importOtherRegExp`

type : `string`

default value: `((\\.)\\w+)$`



> 以下的package regExp 都为此格式 ^(${name}\\/)|^(${name})$
>
> 用于 对 packages 组内部排序  header | other | footer 
>
> 没有被匹配到的会被放入 other



#### `importPackagesHeader`

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
  ]
```



#### `importPackagesFooter`

type: `string[]`

default:

```javascript
['moka-ui', 'sugar-design', '@SDFoundation', '@SDV', '@cms']
```

#### `importAliasConversionLevel`

type: `string`

default: "2"

desc: 相对路径替换别名的层级条件，默认是2层 `../../`



