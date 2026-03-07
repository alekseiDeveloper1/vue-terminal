import express from "express";
import http from "http";
import { Server } from "socket.io"

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let lastTime = Math.floor(Date.now() / 1000);
io.on('connection', (socket) => {
  console.log('a user connected');
  const interval = setInterval(() => {
    lastTime += 86400;
    socket.emit('chartData', {
      time: lastTime,
      value: Math.random() * 100,
    });
  }, 1000);
  socket.on('disconnect', () => clearInterval(interval));
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
