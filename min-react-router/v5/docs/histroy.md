### histroy 模式

其实是用了 history.pushState 这个 API 语法改变，它的语法乍一看比较怪异，先看下 mdn 文档里对它的定义：

> history.pushState(state, title[, url])

其中 state 代表状态对象，这让我们可以给每个路由记录创建自己的状态，并且它还会序列化后保存在用户的磁盘上，以便用户重新启动浏览器后可以将其还原。
title 当前没啥用。
url 在路由中最重要的 url 参数反而是个可选参数，放在了最后一位。
通过 history.pushState({}, '', 'foo')，可以让 baidu.com 变化为 baidu.com/foo。

#### 为什么路径更新后，浏览器页面不会重新加载？

这里我们需要思考一个问题，平常通过 location.href = 'baidu.com/foo' 这种方式来跳转，是会让浏览器重新加载页面并且请求服务器的，但是 history.pushState 的神奇之处就在于它可以让 url 改变，但是不重新加载页面，完全由用户决定如何处理这次 url 改变。
因此，这种方式的前端路由必须在支持 histroy API 的浏览器上才可以使用。

#### 为什么刷新后会 404？

本质上是因为刷新以后是带着 baidu.com/foo 这个页面去请求服务端资源的，但是服务端并没有对这个路径进行任何的映射处理，当然会返回 404，处理方式是让服务端对于"不认识"的页面,返回 index.html，这样这个包含了前端路由相关 js 代码的首页，就会加载你的前端路由配置表，并且此时虽然服务端给你的文件是首页文件，但是你的 url 上是 baidu.com/foo，前端路由就会加载 /foo 这个路径相对应的视图，完美的解决了 404 问题。
history 路由的监听也有点坑，浏览器提供了 window.addEventListener('popstate') 事件，但是它只能监听到浏览器回退和前进所产生的路由变化，对于主动的 pushState 却监听不到。解决方案当然有，下文实现 react-router 的时候再细讲~

```tsx
import React, { useEffect } from 'react';
import { Router, Route, useHistory } from 'react-mini-router';

const Foo = () => 'foo';
const Bar = () => 'bar';

const Links = () => {
  const history = useHistory();

  const go = (path: string) => {
    const state = { name: path };
    history.push(path, state);
  };

  return (
    <div className="demo">
      <button onClick={() => go('foo')}>foo</button>
      <button onClick={() => go('bar')}>bar</button>
    </div>
  );
};

export default () => {
  return (
    <div>
      <Router>
        <Links />
        <Route path="foo">
          <Foo />
        </Route>
        <Route path="bar">
          <Bar />
        </Route>
      </Router>
    </div>
  );
};
```
