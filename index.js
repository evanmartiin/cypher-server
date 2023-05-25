
const { NodeMailerApi } = require("./nodemailerApi");
const { DropBoxApi } = require('./DropBoxApi');
const { Video } = require("./video");

//Init mail & dropbox API
const mail = new NodeMailerApi()
const dropbox = new DropBoxApi()
const videoApi = new Video()

//Init server
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

  socket.on("HELLO", (args) => {
    console.log(args);
  });

  socket.on("CREATE_VIDEO", async (video) => {
    console.log("create video emit");
    //Stock tous les buffers d'une vidéo
    videoApi.saveVideo(video)
    
    io.emit("VIDEO_CREATED", video);
  });

  socket.on("SEND_VIDEO_BY_MAIL", async (id, email) => {
    console.log('send video by mail')
    // const video = await dropbox.getSingleVideo(path)
    const video = videoApi.getVideo(id)
    mail.sendMail(video, email)
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


