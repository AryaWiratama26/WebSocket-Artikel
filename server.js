const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

function getRandomTemperature() {
  return (20 + Math.random() * 10).toFixed(2);
}

wss.on('connection', function connection(ws) {
  console.log('Client terhubung');

  const interval = setInterval(() => {
    const data = JSON.stringify({
      suhu: getRandomTemperature(),
      waktu: new Date().toLocaleTimeString()
    });
    ws.send(data);
  }, 1000);

  ws.on('close', () => clearInterval(interval));
});
