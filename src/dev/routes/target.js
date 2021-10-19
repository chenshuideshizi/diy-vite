import { readFileSync } from 'fs';
import { transformCss, transformJSX } from '../transform';
import { extname } from 'path'
const { resolve } = require('path')

const appRootPath = resolve(__dirname, '../../..')

module.exports = (req, res) => {
    // req.path -----> /target/main.jsx
    // 完整的文件路径
    const filePath = appRootPath + req.path

    // 静态资源给一个 flag
    if ('import' in req.query) {
      console.log(req.query)
      res.set('Content-Type', 'application/javascript');
      res.send(`export default "${req.path}"`);
      return;
    }


    // 对不同类型的文件做不同的处理，返回的是浏览器能够认识的结构，比如如果是 jsx 文件，就需要转成 js
    // 如果是 css 文件，就需要放 style 标签，然后塞到 html header 
    switch(extname(req.path)) {
      case '.svg':
        res.set('Content-Type', 'image/svg+xml');
        res.send(
          readFileSync(filePath, 'utf-8')
        )
        break;
      case ".css":
        res.set('Content-Type', 'application/javascript');
        res.send(
          transformCss({
            path: req.path,
            code: readFileSync(filePath, 'utf-8')
          })
        )
        break;
      default:
        res.set('Content-Type', 'application/javascript');
        res.send(
          transformJSX({
            appRoot: appRootPath,
            path: req.path,
            code: readFileSync(filePath, 'utf-8')
          }).code
        )
        break;
    }
  }