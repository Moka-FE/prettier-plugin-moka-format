# Prettier plugin moka sort

#### Install

npm

```shell script
npm install --save-dev prettier-plugin-moka-sort
```

or, using yarn

```shell script
yarn add --dev prettier-plugin-moka-sort
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

#### `importOrderSeparation` 

type: `boolean`

default value: `false`

```json
"importOrderSeparation" : true
```

desc: 排序分组之后的 import 之间 增加一行空行



#### `importOrderSortSpecifiers`

type: `boolean`

defalut value: false

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



### 此处开始为分组相关api 

> **import 分为固定4组 `packages、components、others、 utils`**
>
> 前三种通过正则匹配path判断import属于哪个分组 
>
> 匹配不到的统一归为 utils 
>
> 如果有本地alias ，可以配置`importAliasRegExp`来避免被归为 packages



#### `importAliasRegExp`

type : `string`

defalut value : `^(@moka-fe|@\/)`



#### `importPackageRegExp`

type: `string`

defalut value: `^([a-z]|@)(.+)$`



#### `importComponentRegExp`

type : `string`

defalut value: `([A-Z](\\w+))$`



#### `importOtherRegExp`

type : `string`

defalut value: `((\\.)\\w+)$`



> 以下的package regExp 都为此格式 ^(${name}\\/)|^(${name})$
>
> 用于 对 packages 组内部排序  header | other | footer 
>
> 没有被匹配到的会被放入 other



#### `importPackagesHeader`

type: `string[]`

defalut : 

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

defalut:

```javascript
['moka-ui', 'sugar-design', '@SDFoundation', '@SDV', '@cms']
```



