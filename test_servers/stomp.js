import http from 'http';
import StompServer from 'stomp-broker-js';

const port = 8891

const server = http.createServer((request, response) => {
    console.log(request.url);
});
const stompServer = new StompServer({
    server: server,
    debug: console.log,
    path: '/ws',
});

console.log(` [*] Listening on 0.0.0.0:${port}`);
server.listen(port);

stompServer.subscribe("/echo", (msg, headers) => {
    var topic = headers.destination;
    console.log(`topic:${topic} messageType: ${typeof msg}`, msg, headers);
    stompServer.send('/echo', headers, `Hello from server! ${msg}`);
});