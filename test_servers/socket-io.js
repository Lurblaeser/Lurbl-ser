import { Server } from "socket.io";
const port = 3000;

const io = new Server({
  cors: {
    origin: "*"
  }
});

io.on("connection", (client) => {
  client.onAny((event, data) => {
    client.emit(event, data)
  })
  client.on('disconnect', () => { /* … */ });
});

io.listen(port)

console.log(` [*] Listening on 0.0.0.0:${port}`);
