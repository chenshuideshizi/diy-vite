import chokidar from 'chokidar'
const createWebSocketServer = require('./ws-server')
const {join} = require('path')
const targetRootPath = join(__dirname, '../../../', 'target');

// 监听文件变更
function watch() {
    return chokidar.watch(targetRootPath, {
      ignored: ['**/node_modules/**', '**/.cache/**'],
      ignoreInitial: true,
      ignorePermissionErrors: true,
      disableGlobbing: true,
    })
}

// 文件变化了执行的回调，里面其实就是用 websocket 推送变更数据
function handleHMRUpdate(opts) {
    const {file, ws} = opts;
    const shortFile = getShortName(file, targetRootPath);
    const timestamp = Date.now();
    let updates
    if (shortFile.endsWith('.css') || shortFile.endsWith('.jsx')) {
      updates = [
        {
          type: 'js-update',
          timestamp,
          path:  `/${shortFile}`,
          acceptedPath: `/${shortFile}`
        }
      ]
    }
  
    ws.send({
      type: 'update',
      updates
    })
  }

module.exports = (server) => {
  const ws = createWebSocketServer(server);
  // 监听文件的变化
  watch().on('change', async (file) => {
    handleHMRUpdate({ file, ws });
  })
}
