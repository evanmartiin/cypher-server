const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const ffmpeg = require('fluent-ffmpeg');
const fs = require("fs");
const { Readable } = require('stream');

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on('HELLO', (args) => {
    console.log(args)
  });

  socket.on('CREATE_VIDEO', async (args) => {
    console.log('create video emit');
    io.emit('VIDEO_CREATED', args)

    ffmpeg(Readable.from(args.buffer))
    .input(Readable.from(args.buffer))
    .on('error', function(err) {
      console.log('An error occurred: ' + err.message);
    })
    .on('end', function() {
      console.log('Merging finished !');
      io.emit('VIDEO_MERGED', fs.readFileSync('./assets/merged.mov'));
    })
    .mergeToFile('./assets/merged.mov', './assets');
  });
});

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000");
});