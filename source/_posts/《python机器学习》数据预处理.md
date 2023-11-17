---
title: 《python 机器学习》数据预处理
author: Jason Lee
date: 2023-10-10 21:20:00
tags: machine-learning
categories: python 机器学习
---

## 缺失数据值的处理

### 在 scikit-learn 中处理缺失数据的方法：

SimpleImputer: SimpleImputer 是 scikit-learn 中用于填充缺失数据的类。你可以使用不同的策略来填充缺失值，包括均值、中位数、众数等。例如：

```
from sklearn.impute import SimpleImputer

imputer = SimpleImputer(strategy='mean')  # 使用均值填充缺失值
X_imputed = imputer.fit_transform(X)
```

KNNImputer: KNNImputer 使用 K-最近邻算法来填充缺失值，根据相邻样本的值进行估计。

```
from sklearn.impute import KNNImputer

imputer = KNNImputer(n_neighbors=5)  # 使用5个最近邻的值来估计缺失值
X_imputed = imputer.fit_transform(X)
```

### 在 pandas 中处理缺失数据的方法：

isna() 和 dropna(): isna() 方法用于检测缺失值，dropna() 方法用于删除包含缺失值的行或列。

```
import pandas as pd

df = pd.DataFrame({'A': [1, 2, None, 4], 'B': [None, 6, 7, 8]})
df.isna()  # 检测缺失值
df.dropna()  # 删除包含缺失值的行
df.dropna(axis=1)  # 删除包含缺失值的列
```

fillna(): fillna() 方法用于填充缺失值，你可以指定要使用的值或方法。

```
df.fillna(value=0)  # 用0填充缺失值
df.fillna(method='ffill')  # 使用前一个非缺失值进行前向填充
df.fillna(method='bfill')  # 使用后一个非缺失值进行后向填充
```

## 处理类别数据

这里对类别数据做一个定义：一般以字符串形式出现，表示类别。类别数据分为两种，一种是内在有数值大小关系的，比如衣服尺寸：S，M，L；另一种是标称特征，不具备排序特征。既然是字符串，我们都要处理为数字方便训练。

### sklearn

这个函数是处理标签列的，本质上是通过枚举，将所有独立的标签从 0 开始编号。之所以可以这样处理，因为我们不关心类标被赋予哪个整数值。

```
from sklearn.preprocessing import LabelEncoder
class_le = LabelEncoder()
y = class_le.fir_transform(df['label'].values)

// 如果要将整数类标还原到字符串，可以用：
class_le.inverse_transform(y)
```

如果是属于特征的类别数据，特别是无序数据，用枚举则是不合适的。这是因为，这会使得模型假定不同类别之间有顺序关系。所以，独热编码更合适。

```
from sklearn.preprocessing import OneHotEncoder
ohe = OneHotEncoder()
ohe.fit_transform(df['color'].values)
```

### pandas

pandas 有 get_dummies 可以用于实现独热编码

```
pd.get_dummies(df) // 只对字符串列进行转化
```
