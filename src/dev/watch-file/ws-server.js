import WebSocket from 'ws';
// 建立一个 websocket 服务，封装 send 方法
function createWebSocketServer(server) {
    const wss = new WebSocket.Server({ noServer: true })
  
    server.on('upgrade', (req, socket, head) => {
      if (req.headers['sec-websocket-protocol'] === 'vite-hmr') {
        wss.handleUpgrade(req, socket, head, (ws) => {
          wss.emit('connection', ws, req);
        });
      }
    });
  
    wss.on('connection', (socket) => {
      socket.send(JSON.stringify({ type: 'connected' }));
    });
  
    wss.on('error', (e) => {
      if (e.code !== 'EADDRINUSE') {
        console.error(
          chalk.red(`WebSocket server error:\n${e.stack || e.message}`),
        );
      }
    });
  
    return {
      send(payload) {
        const stringified = JSON.stringify(payload);
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(stringified);
          }
        });
      },
  
      close() {
        wss.close();
      },
    }
  }

  module.exports = createWebSocketServer