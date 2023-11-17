---
title: React 入门
date: 2022-12-16 16:20:40
tags: React
categories:
---

[教程](https://www.bilibili.com/video/BV1Me4y1h7bQ)来自 b 站。

<!-- more -->

创建 react 项目：`npx create-react-app dojo-blog`

组件的本质是返回一个 jsx 模板的函数，且这个函数在 js 文件的最后被导出。

对象不能直接插入到的 jsx 中，但是可以作为标签属性插入。（比如 style)

```
<a href="/" style={{
  backgroundColor: "red",
  color: "white",
}}>Home</a>
```

style 里面，外层是告诉 react,这是一个变量， 内层是告知是对象。

### hooks

useEffect: 在浏览器发生渲染时触发，接收的参数为：

```
useEffect(<function>, <dependency>)
```

第二个参数可选，作用是控制触发条件。如果置空，就是每次渲染都触发回调函数。如果是 `[]`,则只有一次。还可以在数组内加上自定义变量，表示监控自定义变量。

### json-server

在前端开发过程中， 为了临时创建一个 restful api, 又无需起一个完整的后台。json-server 这个 npm 包可以根据一些 json 字符串创建一个接口，react 程序可以访问来模拟真实请求。启动 json-server 代码：

```
npx json-server --watch json-file-path --port 8000
```

### 自定义通用钩子函数

有时候，一些钩子函数的代码块可以在项目中通用。将他放在一个单独的文件中，如下：

```js
import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          console.log(res);
          throw Error("could not fetch data");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setIsPending(false);
        setError(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsPending(false);
      });
  }, [url]);
  return { data, isPending, error };
};

export default useFetch;
```

### router, route, routes 的区别

router 路由器，整体的概念，路由的载体

route 路由，一条记录实体，记录了访问资源的路径

routes 路由的复数，多条记录

路由使用步骤：

1. 先在根组件注册路由。

   ```
    <Router>
      <div className="App">
        <Navbar></Navbar>
        <div className="content">
          <Switch>
            <Route exact path='/'>
              <Home></Home>
            </Route>
            <Route exact path='/create'>
              <Create></Create>
            </Route>
          </Switch>


        </div>
      </div>
    </Router>
   ```

   注册完组件，浏览器输入 url 访问，或者点击超链接，react 应用都会拦截到请求，并将路由注册所在页面渲染出来。

2. 使用超链接访问路由的方式。Link 标签会被 react 转化为浏览器能够识别的 a 标签。

   ```
   <Link to='/'>Home</Link>
   <Link to='/create'>New Blog</Link>
   ```

### react 表单

表单的变量要在 useState 函数里注册，表单内部通过监听 onChange 事件，结合 set，来实现动态变量的实时更新。创建好表单后，需要发起 post 请求。注册一个事件：handleSubmit，用 fetch 发送 post 请求，提交数据成功后，跳转到首页。

```js
import { useState } from "react";
import { useHistory } from "react-router-dom";

const Create = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("mario");
  const [isPending, setisPending] = useState(false);
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault(); // 阻止表单提交后默认清空
    const blog = { title, author, body };

    fetch("http://localhost:8000/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blog),
    })
      .then(() => {
        console.log("add ok");
        setisPending(false);
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="create">
      <h2>Add a new blog</h2>
      <form onSubmit={handleSubmit}>
        <label>Blog title:</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Blog body:</label>
        <textarea
          required
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
          }}
        ></textarea>
        <label>Blog author</label>
        <select
          value={author}
          onChange={(e) => {
            setAuthor(e.target.value);
          }}
        >
          <option value="mario">mario</option>
          <option value="yoshi">yoshi</option>
        </select>
        {!isPending && <button type="submit">submmit</button>}
        {isPending && <button type="submit">Adding Post...</button>}
      </form>
    </div>
  );
};

export default Create;
```
