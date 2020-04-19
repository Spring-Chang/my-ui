# 表格组件

table组件是获取数据列表的组件，支持http 6种请求格式，符合resultful接口调用风格。

## 用法

创建一个简单的HTML表格，定义好table的thead部分即可。需要填充数据的列必要带有field属性，
field属性值就是resultful接口返回数据列表的字段名，其他属性按需添加。

```js
    <table id="table" class="myui-table">
        <caption>梁山好汉排名</caption>
        <tr>
            <th style="height: 5px;" field="index" >座次</th>
            <th style="height: 5px;" field="name" >原名</th>
            <th style="height: 5px;" field="nickName">昵称</th>
            <th style="height: 5px;" field="constellation" >星宿</th>
            <th style="height: 5px;" field="birthDay" >生日</th>
            <th style="height: 5px;" field="sex" >性别</th>
            <th style="height: 5px;" field="effectiveness" >战斗指数</th>
            <th style="height: 5px;" field="specialSkills" >特殊技能</th>
            <th style="height: 5px;" field="remark" >备注</th>
        </tr>
    </table>
```

js代码初始化组件

```js
    $('#table').table({
        url : './table_data.json'
    });
```

table表格头部可以是单行表格也可以是复杂表格，如果为多行表格，只需要在需要填充数据的列
加上file属性即可，否则表格会错乱或变形。初始化组件代码中url为必填参数，默认请求类型为Get请求。

格式化列的数据：有时候需要格式化数据列的格式，此时只需添加formatter属性即可，my-ui框架内置
了一些数据格式【number, date-box】，如果内置格式不满足需求，可在初始化组件的时候传递回调函数，
并且html元素的formatter属性值指向回调函数名。

```js
    <th style="height: 5px;" field="sex" formatter="sexFormatter">性别</th>

    $('#table').table({
        url : './table_data.json',
        sexFormatter : function (value, row, index) { //性别格式化回调函数
            if(value) {
                return "男";
            } else if(!value) {
                return "女";
            }
            return value;
        }
    });
```

## table属性

| 属性名 | 数据类型 | 备注 |   默认值 |
| :-----| :---- | :---- |   :---- |
| url | 字符串 | table表格请求后台的url地址 | null,必填 | 
| method | 字符串 | http请求方式，支持5种请求方式[get, post, put, delete, head] | get,选填 |
| 函数名 | 函数 | 向组件种注册函数，一般在formatter属性中指定到该函数名，否则不会被调用 | null,选填 |

## 列属性

| 属性名 | 数据类型 | 备注 |   默认值 |
| :-----| :---- | :---- |   :---- |
| field | 字符串 | 从后台请求到的数据列表元素的属性名 | null,必填 | 
| formatter | 字符串 | 数据格式化形式，框架提供了[number, date-box]类型，需要额外定义格式逻辑可指定回调函数名，调用回调函数时传递的参数列表分别是：value, row, index | null,选填 |

