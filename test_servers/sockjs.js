import http from 'http';
import sockjs from 'sockjs';

const port = 8892

const server = http.createServer((request, response) => {
    console.log(request.url);
});
const sockjsServer = sockjs.createServer({ prefix:'/ws' });

console.log(` [*] Listening on 0.0.0.0:${port}`);
sockjsServer.installHandlers(server);
server.listen(port, 'localhost');

sockjsServer.on('connection', function(conn) {
  conn.on('data', function(message) {
    conn.write(message);
  });
  conn.on('close', function() {});
});
