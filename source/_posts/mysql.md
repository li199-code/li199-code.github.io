---
title: mysql
date: 2022-11-18 20:48:20
tags:
- mysql
---

mysql的单表查询很简单，但是单表体积增大时，或者涉及到多表查询时就成了难点。本文主要对这些问题做一些记录。

<!-- more -->

## mysql工作原理

mysql服务启动，监听3306端口。外界的客户端，如cmd，django框架，heidisql都视作客户端，用户名密码验证后可以连接到mysql服务。在操作系统中，数据库视作文件夹，每一张表都是一个特殊后缀的文件。
![1668775623718.png](https://img1.imgtp.com/2022/11/18/i1KAwxVu.png)

## 数据库的备份和恢复

备份的本质是创建一个sql文件。命令：

```sql
mysql -u -p -B db1 db2 > d:\\xxx.sql  -- 按照数据库来备份
mysql -u -p db1 table1 table2 > d:\\yyy.sql  -- 按照表来备份
source d:\\xxx.sql  -- 恢复
```

## 分页

在数据库规模较大的情况下，每次请求都是请求部分，这样就需要分页。

```sql
select * from table limit 每页记录数*（页序号-1）, 每页记录数
```

## 多子句查询的先后顺序

```sql
select * from table
	group by ..
	hanving ..
	order by ..
	limit ..
```

## 自连接

将一张表当作两张表联合查询，需要给表取别名。

```sql
select * from table1 as A, table1 as B where ...
```

## 表自复制和去重

```sql
insert into table select * from table  -- 自复制，也可以用于制作表的备份
------
-- 表格去重流程：先创建新表，将去重的数据写入新表，然后删掉旧表，将新表改名
create table new like old;  --创建字段和旧表一致的新表
insert into new select distinct * from old;
drop table old;
alter table new rename old;
```

## 外连接

按照下列模式：

```sql
select * from table1, table2 where ...
```

是在两表的笛卡尔积上进行筛选，这样，不符合筛选条件的数据不会列出。有时候我们需要列出不符合筛选条件的数据。外连接分为左右，以左外连接为例，左表的每一项都进入结果中，对于没有匹配上的字段，则赋为Null。语法：

```sql
select * from table1 left join table2 on ... -- 筛选条件是on
```

## 外键

为了对新插入的数据进行约束，引入了外键。假设，表A作为主表，也就是约束条件，表B作为从表，只能插入表A中主键存在的数据。一旦主表的主键被引用，就不能删除。

```sql
create table tab (
	id int primary key,
	class_id int,
	--下面指定外键
	foreign key (class_id) references my_class(id), -- my_class是主表。id必须是主键或者unique
)
```

## check约束

注：mysql 8.0.16后开始全面支持check约束。

```sql
CREATE TABLE cc (
	id INT,
	sex VARCHAR(10) CHECK (sex IN('male', 'female'))
);
```

## 索引

索引是对一个字段建立的一个二叉树，提升查找速度。是一种空间换时间的策略。对于查找操作多于修改操作的数据库很有必要。
```sql
create index_name on table (ziduan)
```

## 事务

为了能将多个sql语句作为一个整体执行，事务提出，将增删改包裹起来。

```sql
start transaction; -- 开始事务，此时其他会话看不到事务过程中修改的数据结果
-- 执行一些操作 --
savepoint A; -- 设置保存点A
-- 执行一些操作 --
rollback to A; -- 回退到保存点A
rollback; -- 回退到事务开始时状态
commit -- 提交事务，删除所有保存点，此时修改后的数据向其他会话开放
```

## 隔离

为了确保事务获得数据的准确性，提出了隔离。默认隔离级别下，不同事务同时开启造成的问题有：

![1668952763819.png](https://img1.imgtp.com/2022/11/20/w3dP2bXN.png)

事务隔离级别和各级别会出现的问题：

![1668952901628.png](https://img1.imgtp.com/2022/11/20/Q4XkXqXT.png)

```sql
select @@transaction_isolation; --查看当前事务隔离级别（mysql8.0+，低版本为select @@tx_isolation）
```
