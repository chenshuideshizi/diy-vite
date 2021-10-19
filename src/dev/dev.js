import express from 'express';
import { createServer } from 'http';
import { join, extname, posix } from 'path'
const watch = require('./watch-file')

const homeRouteCb = require('./routes/home')
const clientRouteCb = require('./routes/client')
const targetRouteCb = require('./routes/target')


// esm 机制：import 的内容都会走请求去拉取资源，我们自己起一个服务，就可以对这些请求的返回进行拦截处理，返回我们处理过后的内容
// 整个应用就完全基于 node 服务，静态资源加载，没有编译构建的过程，肯定就会很快了。




function getShortName(file, root) {
  return file.startsWith(root + '/') ? posix.relative(root, file) : file;
}



// --------------------- 梳理 ----------------------
/**
 * 1. 起一个 node 服务
 * 2. 模版项目的文件，就都走静态资源路径了
 * 3. html 返回
 * 4. html 返回之前呢，塞一个 client 进去，<script src="/a/client" type="module"/>
 * 5. 写这个接口 /a/client -> 内置的 client.js -> HMR
 * 6. server - websocket - client
 * 7. 监听文件变更（三方库）-> 封装一个数据结构（变更） -> websocket -> client
 * 8. 其它文件 .css .jsx 的处理
 * 9. css -> js -> createElement('style') -> header
 * 10. .jsx -> .js (引用三方，本地) / 三方（缓存） + 本地（拼路径）
 * 11. plugin 系统等
 */
// --------------------- 梳理 ----------------------

// 1. 使用 express 起一个服务 (express, koa, golang...都可以)
// 2. 拦截入口请求: localhost:3002 -> 返回它 html 文件
// 3. 加一些骚操作，比如 「热更新」 HMR
export async function dev() {
  const app = express();

  // 拦截这个入口请求，返回给用户处理过的 html 文件
  app.get('/', homeRouteCb)

  // 把客户端代码塞给浏览器，给 html
  app.get('/@vite/client', clientRouteCb)

  // 静态文件的处理，返回给浏览器能认识的
  app.get('/target/*', targetRouteCb)

  const server = createServer(app);


  watch(app)

  // 启动服务
  const port = 3002;
  server.listen(port, () => {
    console.log(`App is runing at http://127.0.0.1:${port}`);
  })
}
