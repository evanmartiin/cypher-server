const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  
  socket.on('HELLO', (args) => {
    console.log(args)
  });

  socket.on('CREATE_VIDEO', (args) => {
    console.log('create video emit');
    io.emit('VIDEO_CREATED', args)

    const buffers = Array.from({ length: 3 }, () => Buffer.from(args.buffer));
    
    io.emit('VIDEO_MERGED', Buffer.concat(buffers));
  });

});

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000");
});
