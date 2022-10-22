import http from 'http';
import StompServer from 'stomp-broker-js';

const port = 8890

const server = http.createServer((request, response) => {
  console.log(request.url);
});
const stompServer = new StompServer({
  server: server,
  debug: console.log,
  path: '/ws',
  protocol: 'sockjs',
  heartbeat: [2000,2000],
});

console.log(` [*] Listening on 0.0.0.0:${port}`);

server.listen(port, 'localhost');

stompServer.subscribe("/echo", (msg, headers) => {
  var topic = headers.destination;
  console.log(`topic:${topic} messageType: ${typeof msg}`, msg, headers);
  stompServer.send('/echo', headers, `Hello from server! ${msg}`);
});