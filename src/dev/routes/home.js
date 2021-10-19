import { readFileSync } from 'fs';
const { join } = require('path')
const targetRootPath = join(__dirname, '../../../', 'target');

module.exports = (req, res) => {
  // content-type
  res.set('Content-Type', 'text/html');
  // html 文件的绝对路径
  const htmlPath = targetRootPath + '/index.html';
  // 根据路径取读文件，获取到文件的字符串
  let html = readFileSync(htmlPath, 'utf-8');
  // 塞入客户端代码（包含了热更新等）
  html = html.replace('<head>', `<head>\n  <script type="module" src="/@vite/client"></script>`).trim()
  res.send(html);
}