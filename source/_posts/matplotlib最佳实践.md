---
title: matplotlib最佳实践
author: Jason Lee
date: 2023-04-21 14:25:44
tags: matplotlib
categories:
---

## 前言

跟着油管上的[教程](https://www.youtube.com/watch?v=UO98lJQ3QGI&list=PL-osiE80TeTvipOqomVEeZ1HRrcEvtZB_&ab_channel=CoreySchafer)学的，作者介绍了一些最佳实践，融合一些自己的思考，把觉得有用的东西记录一下。

## part1 折线图

```
# 导包区
from matplotlib import pyplot as plt
# plt.style.use('seaborn') # 切换图片风格
plt.xkcd() # 手绘风格

# 数据区
ages_x = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]
dev_y = [38496, 42000, 46752, 49320, 53200,
         56000, 62316, 64928, 67317, 68748, 73752]
py_dev_y = [45372, 48876, 53850, 57287, 63016,
            65998, 70003, 70000, 71496, 75370, 83640]

# 绘图区
plt.plot(ages_x, dev_y, color='k', linestyle='--', label='All Devs')
plt.plot(ages_x, py_dev_y, color='b',marker='o', label='Python Devs')

plt.xlabel('Ages')
plt.ylabel('Median Salary')
plt.title('Median Salary By Age')
plt.legend()

plt.grid(True)

plt.show()
```

plot.plot()函数，一个对应一条曲线，而且，color, linestyle, marker单独作为参数写，而不是混在一起；还有，把图例放在plot函数里而不是legend()，都是为了增加可读性。

## part2 柱状图

画柱状图的函数是plt.bar()。但是如果将上述的plt.plot()改成plt.bar()，会出现重叠的情况。为了避免重叠，需要添加偏移。

```
ages_x = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]
dev_y = [38496, 42000, 46752, 49320, 53200,
         56000, 62316, 64928, 67317, 68748, 73752]
py_dev_y = [45372, 48876, 53850, 57287, 63016,
            65998, 70003, 70000, 71496, 75370, 83640]
js_dev_y = [37810, 43515, 46823, 49293, 53437,
            56373, 62375, 66674, 68745, 68746, 74583]

x_indexes = np.arange(len(ages_x))
width=0.25
```

width是柱的宽度，柱的数量*width应该小等于1。

```
plt.bar(x_indexes-width, dev_y, color='k', width=width, label='All Devs')
plt.bar(x_indexes, py_dev_y, color='b', width=width, label='Python Devs')
plt.bar(x_indexes+width, js_dev_y, color='g',width=width, label='JavaScript Devs')
```

![](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16820744899401682074489216.png)

紧接着，作者给出了一个实例，从csv文件读取数据，并统计各个编程语言的使用人数。用的是python标准csv库进行读取，后续可以用pandas。

```
with open('data.csv') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    counter = Counter()
    
    for row in csv_reader:
        counter.update(row['LanguagesWorkedWith'].split(';'))
    
print(counter)
with open('data.csv') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    counter = Counter()
    
    for row in csv_reader:
        counter.update(row['LanguagesWorkedWith'].split(';'))
    
print(counter)

Counter({'JavaScript': 59219, 'HTML/CSS': 55466, 'SQL': 47544, 'Python': 36443, 'Java': 35917, 'Bash/Shell/PowerShell': 31991, 'C#': 27097, 'PHP': 23030, 'C++': 20524, 'TypeScript': 18523, 'C': 18017, 'Other(s):': 7920, 'Ruby': 7331, 'Go': 7201, 'Assembly': 5833, 'Swift': 5744, 'Kotlin': 5620, 'R': 5048, 'VBA': 4781, 'Objective-C': 4191, 'Scala': 3309, 'Rust': 2794, 'Dart': 1683, 'Elixir': 1260, 'Clojure': 1254, 'WebAssembly': 1015, 'F#': 973, 'Erlang': 777})
```

画图用bar函数的话，x轴就会很拥挤。所以采用横柱状图plt.barh()，将x，y颠倒。

![](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16820748929351682074891976.png)

## part3 饼状图

饼状图一般适合五种以下的数据展示。

```
slices = [59219, 55466, 47544, 36443, 35917]
labels = ['JavaScript', 'HTML/CSS', 'SQL', 'Python', 'Java']
explode = [0, 0, 0, 0.1, 0]

plt.pie(slices, labels=labels, explode=explode,startangle=90, autopct='%1.1f%%', wedgeprops={'edgecolor': 'black'})

## wedgeprops: 楔子属性？反正就是设置图表的一些性质

plt.title('My Awesome Pie Chart')
plt.show()
```

![](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16820787849411682078784535.png)

## part4 堆积面积图

堆积面积是stackplot的直译，但似乎不是很妥当？api是plt.stackplot()

![](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16821263319421682126331749.png)

## part5 折现填充图

在折现的上方或下方进行填充，直观地表示差距。
```
plt.plot(ages, py_salaries, label='Python')
```

![](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16821275949341682127594019.png)

## part6 直方图

bins是每根柱代表的数据间距, log表示将数据取对数
```
plt.hist(ages, bins=bins, edgecolor='black', log=True)
```
![](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16821444843081682144484185.png)


## part7 散点图

```
plt.scatter(views, likes, c=ratio, cmap='summer', edgecolor='black', linewidth=1, alpha=0.75)
cbar = plt.colorbar()
cbar.set_label('Like/Dislike Ratio')

plt.xscale('log')
plt.yscale('log')

plt.title('Median Salary By Age')
plt.xlabel('View Count')
plt.ylabel('Total Likes')
plt.show()
```

c是指颜色的深浅度，cmap设置颜色的系列，plt.colorbar()在图中添加彩色条，plt.xscale('log')将刻度改为对数，防止过大的数远离图表中心。

![](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16821519242431682151923660.png)

## part8 时序图
```
data['Date'] = pd.to_datetime(data['Date']) ##把字符串解析为日期格式
data.sort_values('Date', inplace=True)

price_date = data['Date']
price_close = data['Close']

plt.plot_date(price_date, price_close, linestyle='solid')

plt.gcf().autofmt_xdate() ## 自动格式化日期
```

![](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16821546612471682154660773.png)

## part9 动画

这是和深度学习相关的一个场景，比如损失函数的显示就是动态的。

```

import random
from itertools import count
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

plt.style.use('fivethirtyeight')

x_vals = []
y_vals = []

# plt.plot(x_vals, y_vals)


index = count()

def animate(i):
    x_vals.append(next(index))
    y_vals.append(random.randint(0, 5))

    plt.cla()
    plt.plot(x_vals, y_vals)

ani = FuncAnimation(plt.gcf(), animate, interval=1000)
plt.tight_layout()
plt.show()
```

但是上述代码在jupyter中无法正常运行，只能用pycharm来输出。

## part10 子图

```
plt.style.use('seaborn')

data = pd.read_csv('data.csv')
ages = data['Age']
dev_salaries = data['All_Devs']
py_salaries = data['Python']
js_salaries = data['JavaScript']

fig1, ax1 = plt.subplots()
fig2, ax2 = plt.subplots()

ax1.plot(ages, dev_salaries, color='#444444',
         linestyle='--', label='All Devs')

ax2.plot(ages, py_salaries, label='Python')
ax2.plot(ages, js_salaries, label='JavaScript')

ax1.legend()
ax1.set_title('Median Salary (USD) by Age')
ax1.set_ylabel('Median Salary (USD)')

ax2.legend()
ax2.set_xlabel('Ages')
ax2.set_ylabel('Median Salary (USD)')

plt.tight_layout()

plt.show()

fig1.savefig('fig1.png')
fig2.savefig('fig2.png')
```

首先，子图中最重要的概念是figure和axis。之前的代码都是针对figure（默认），figure可以认为是一个容器，表现为窗口；axis就是一张具体的图。