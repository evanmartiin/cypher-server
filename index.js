
const { NodeMailerApi } = require("./nodemailerApi");
// const { DropBoxApi } = require('./DropBoxApi');
const { Video } = require("./video");

//Init mail & dropbox API
const mail = new NodeMailerApi()
// const dropbox = new DropBoxApi()
const videoApi = new Video()

//Init server
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const buffers = new Map()


app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("HELLO", (args) => {
    console.log(args);
  });

  socket.on("CREATE_VIDEO", async (video) => {
    console.log("create video emit");
    //Stock tous les buffers d'une vidéo
    videoApi.saveVideo(video)
    
    io.emit("VIDEO_CREATED", video);
  });

  socket.on("SEND_VIDEO_BY_MAIL", async (video) => {
    console.log('send video by mail')
    // const video = await dropbox.getSingleVideo(path)
    if (buffers.has(video.id)) {
      buffers.get(video.id).push(video);
    } else {
      buffers.set(video.id, [video]);
    }

    if (video.length > video.index + 1) return;

    const blobVideo = await videoApi.getVideo(buffers, video.id)
    mail.sendMail(blobVideo, video.email)
    buffers.delete(video.id)
  })

  socket.on("ID_CREATED", (id) => {
    io.emit("SEND_ID", id)
  })
});

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000");
});


