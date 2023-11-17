---
title: 基于eggjs, sequelize和pgsql的小需求
author: Jason Lee
date: 2023-09-29 12:13:49
tags:
  - eggjs
  - sequelize
categories:
---

## 前言

这是我在部门遇到的第一个小需求。这一次，我写的是后端代码。刚开始，我还陷入在一种思维定式里，似乎一定要在现有项目的工程里添加代码。如果这样做，就需要在本地或者测试服务器启动项目，然而不熟悉服务器环境和配置的我，容易卡在一个环节上无法继续。我后面想明白了，完全可以将其视作一个独立的小项目。

## pgsql 启动入口

不同于 mysql 直接通过命令行工具启动，pgsql 的启动方式有两种。一种是自带的 pgadmin4 这款数据库可视化软件，只要第一次连接上，后续打开都会自动连接。另一种是 sql shell, 也是随 pgsql 一起安装的。打开后，前面几个参数都是默认，最后输入口令（密码）。

![16959671454581695967145365.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16959671454581695967145365.png)

## eggjs+sequelize 的开发流程

### 初始化 egg 项目和安装 npm 包

```
$ npm init egg --type=simple
$ npm i

# sequelize 和 nodejs的pgsql驱动
npm install --save egg-sequelize pg pg-hstore
```

### 在 config/plugin.js 中引入 egg-sequelize 插件

```
'use strict';

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};
```

### 在 config/config.default.js 中编写 sequelize 配置

```
/* eslint valid-jsdoc: "off" */

'use strict';

module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1696034448361_9424';

  // add your middleware config here
  config.middleware = [];

  // mysql

  // config.sequelize = {
  //   dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
  //   database: 'egg-sequelize-example-dev',
  //   host: '127.0.0.1',
  //   port: 3306,
  //   username: 'root',
  //   password: 'root',
  // };

  // pgsql

  config.sequelize = {
    database: 'egg-sequelize-example-dev',
    username: 'postgres',
    password: 'root',
    host: 'localhost', // 或者你的数据库主机地址
    port: 5432, // 或者你的数据库端口号
    dialect: 'postgres', // 指定数据库类型为PostgreSQL
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};

```

### 创建数据库和数据表（在 pgadmin4 等工具中写 sql 语句）

```
CREATE DATABASE IF NOT EXISTS 'egg-sequelize-doc-default';
create table [name];
```

### 编写 model

注意字段要和数据表中定义的完全一致。这时候，model 可以通过 ctx.model 访问到，在编写 controller 或 service 层时可通过 ide 检查能否找到 model，若不能，检查 typings 文件夹下相应的 index.d.ts 文件，看看名称能否对应上。

```
# app/model/station.js

'use strict';

module.exports = (app) => {
	const { STRING, INTEGER, TEXT, DATE } = app.Sequelize;
	const { DataTypes } = require('sequelize');

    const Station = app.model.define('Station', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: STRING(30), allowNull: false },
      associated_yard: { type: STRING(30), allowNull: false },
      address: { type: STRING(50) },
      longitude: { type: DataTypes.NUMERIC(5), allowNull: false},
      latitude: { type: DataTypes.NUMERIC(5), allowNull: false },
      province: {type: STRING(32), allowNull: false},
      city: {type: STRING(32), allowNull: false},
      county: { type: STRING(32), allowNull: false },
      tag: { type: DataTypes.ARRAY(DataTypes.TEXT) },
      property_unit: { type: STRING(30) },
      property_contact: { type: STRING(30) },
      property_phone: { type: STRING(11) },
      status: { type: STRING(10), allowNull: false },
      map_induction: { type: DataTypes.BOOLEAN, allowNull: false },
      area: { type: STRING(30) },
      accounting_policy: { type: STRING(30), allowNull: false },
      operating_description: { type: TEXT, allowNull: false },
      comment: { type: TEXT },
      created_at: DATE,
      updated_at: DATE,
    });

    return Station;
};
```

上述代码中需要注意 sequelize 的表名推导问题。在`const Station = app.model.define('Station', {...})`中，第一个 Station 是模型名称，是 eggjs 中调用 app.model.[name]用到的名称。然后 define 函数中的'Station'和数据库中的表明存在对应关系，具体的对应规则是：

1. 默认的是单数转复数：默认情况下，Sequelize 会将模型的名称转换为复数形式，并将其用作数据库表的名称。比如，station 转成 stations。所以创建表时，应该把表命名为复数形式。
2. 自定义表名：可以在定义模型时明确指定要映射到的表的名称。

```
const User = sequelize.define('User', {
  // 模型属性定义
}, {
  tableName: 'custom_users_table' // 自定义表名
});
```

### 编写 controller 和 service 层，在 router.js 中添加路由。
