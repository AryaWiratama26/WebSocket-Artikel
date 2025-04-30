const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

console.log("WebSocket server berjalan di ws://localhost:8080");

wss.on('connection', function connection(ws) {
  console.log('Klien terhubung.');

  ws.on('message', function incoming(message) {
    console.log('Pesan diterima:', message.toString());

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log("Klien terputus.");
  });
});
