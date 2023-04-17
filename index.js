const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

const a =
  "http://thinkingform.com/wp-content/uploads/2017/09/video-sample-mp4.mp4?_=1";
const b =
  "https://drive.google.com/file/d/1RCBMvLbERASjB9TNLISCrUdsj1oQi_t8/view";

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on('HELLO', (args) => {
    console.log(args)
  });

  socket.on('CREATE_VIDEO', async (args) => {
    console.log('create video emit');
    io.emit('VIDEO_CREATED', args)
    
    const c = await fetch(a);
    const d = await fetch(b);

    const chunks = [];
    for await (let chunk of c.body) {
      chunks.push(chunk);
    }
    const e = Buffer.concat(chunks);

    const chunks2 = [];
    for await (let chunk of d.body) {
      chunks.push(chunk);
    }
    const f = Buffer.concat(chunks2);

    io.emit('VIDEO_MERGED', Buffer.concat([e, f]));
  });

});

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000");
});
