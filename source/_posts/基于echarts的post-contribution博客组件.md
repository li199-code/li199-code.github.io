---
title: 基于echarts的post contribution博客组件
date: 2024-01-12 23:03:33
updated: 2024-01-12 23:03:33
tags: 
- echarts
- 网站建设
categories:
---

最近觉得博客的archive页太空旷了，和首页雷同，且文章多了之后，archieve页很长。archive页平时也不做停留，基本没有意义。因此，我决定改造一下archive，修复并添加一些东西。首先是历史文章要支持展开和收起，这样，archive页面就不会过长了。然后，仿照github contribution, 做一个post contribution，记录历史文章提交日历图。

## 展开/收起控件添加

在年份上添加一个onclick事件，来控制对应年份文章的display属性。难点是原模板中年份div和post-item div是平级的，即：

```html
<div class='year'></div>
<div class='post-item'></div>
<div class='post-item'></div>
<div class='post-item'></div>
...
<div class='year'></div>
<div class='post-item'></div>
<div class='post-item'></div>
<div class='post-item'></div>
...

```

这样兄弟选择器是没法只选中对应的年份的所有文章的。解决方法是给文章的div添加对应的年份class，如'y2023'.并且给onclick事件传入年份变量。

## post contribution

echarts是一个开源的图表库，支持创建丰富类型的图表，且配置性高。

---

echarts使用手册
https://echarts.apache.org/handbook/zh/get-started/

---

开始并不顺利，安装就卡住了。按照'hexo echarts'去google，得到的方案是装一个npm包，但是实际上无效，图表没有被解析。后来用了质朴的cdn导入方式才成功。安装成功后，跑了一个demo也成功了，可是实现我的定制化需求时又犯了难。我的需求是，显示过去一年内，每天的文章创建数。echarts有很多配置项，不看文档是搞不清楚的。然而，配置项文档都是文字说明，没有对应的效果展示。还好，有chatgpt。描述好需求，gpt给出了非常接近的答案，再经过几轮问答补充细节后，我想要的效果就达成了。

接着是数据的问题。我一开始的想法是，先在ejs中遍历site.posts，获得一个键为日期，值为当日发布文章数的对象。然后创建一个数据生成函数，遍历近一年的每一天，从之前的对象中取值。但是，当我实现到一半，发现一个问题：ejs创建的对象，无法被script标签读到。又是gpt给出了解决方案：将对象绑定在全局window上。

完整代码：

```javascript
  <div id="main" style="width:100%; height:300px; margin: 0 auto"></div>
  <%
  const postsCountByDate = {};
  site.posts.each((item, index) => {
    let postDate = new Date(item.date);
    // 获取年、月、日
    let formattedDate = postDate.getFullYear() + '-' + (postDate.getMonth() + 1) + '-' + postDate.getDate();
    postsCountByDate[formattedDate] = (postsCountByDate[formattedDate] || 0) + 1;
  });
  %>

  <script>
    // 将 postsCountByDate 绑定到全局对象 window 上
    window.postsCountByDate = <%- JSON.stringify(postsCountByDate) %>;
  </script>
  
  
  
  <script type="text/javascript">


      var chartDom = document.getElementById('main');
      var myChart = echarts.init(chartDom);
      var option;

      function generateRandomData(startDate, endDate) {
        let currentDate = new Date(startDate);
        const endDateObj = new Date(endDate);
        const data = [];
        

        while (currentDate <= endDateObj) {
          let formattedCur = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
          const val = postsCountByDate[formattedCur] || 0
          // const val = Math.floor(Math.random() * 100); // 生成 0 到 99 之间的随机数
          data.push([currentDate.toLocaleDateString(), val]);

          currentDate.setDate(currentDate.getDate() + 1);
        }

        return data;
      }

      const startDate = new Date(); //
      startDate.setFullYear(startDate.getFullYear() - 1); // 一年前的日期 e.g 2023.1.10
      const endDate = new Date(); // 当前日期 e.g 2024.1.10

      const simulatedData = generateRandomData(startDate, endDate);

      option = {
        title: {
          top: 30,
          left: 'center',
          text: 'Post Contribution'
        },
        tooltip: {},
        visualMap: {
          show: true,
          min: 0,
          max: 3, // 你的数据中的最大值
          calculable: true,
          orient: 'horizontal',
          left: 'right',
          bottom: 10,
          inRange: {
            color: ['#FFFFFF', '#FF0000'] // 白色到其他颜色的渐变色，可以根据需要调整颜色值
          },
          pieces: [
            { value: 0, color: '#FFFFFF' }, // 将值为0的数据映射到白色
            { min: 1 } // 其他数据按照设定的颜色渐变
          ]
        },

        calendar: {
          top: 120,
          left: 30,
          right: 30,
          cellSize: ['auto', 13],
          range: [startDate, endDate],
          itemStyle: {
            borderWidth: 0.5
          },
          yearLabel: { show: false }
        },
        series: {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: simulatedData
        }
      };

      option && myChart.setOption(option);

    
  </script>
```

附上改造后的archive页：

![17051159772241705115976390.png](https://fastly.jsdelivr.net/gh/li199-code/blog-img-2@main/17051159772241705115976390.png)






