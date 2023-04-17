const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const ffmpeg = require("fluent-ffmpeg");
const { StreamInput } = require("fluent-ffmpeg-multistream");
const fs = require("fs");
const { Readable, PassThrough } = require("stream");

const buffers = new Map();
const completeBuffers = new Map();

function mergeVideos() {
  buffers.forEach((videos, id) => {
    if (videos.length === videos[0].length) {
      completeBuffers.set(
        id,
        videos
          .sort((a, b) => a.index - b.index)
          .map((video) => video.buffer)
      );
      buffers.delete(id);
    }
  });
}

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
    io.emit("VIDEO_CREATED", video);


    console.log("Video received: " + video.index);
    
    if (buffers.has(video.id)) {
      buffers.get(video.id).push(video);
    } else {
      buffers.set(video.id, [video]);
    }

    mergeVideos();
    if (!completeBuffers.has(video.id)) return;

    console.log("Video merging: " + video.index + "/" + video.length)

    const inputVideos = completeBuffers.get(video.id);

    const tempFiles = inputVideos.map((video, i) => {
      const filePath = `temp_${i}.mp4`;
      fs.writeFileSync(filePath, Buffer.from(video));
      return filePath;
    });

    const command = ffmpeg();
    tempFiles.forEach((file) => {
      command.input(file);
    });

    command
      .on("error", (err, stdout, stderr) => {
        console.error(err);
        console.error(stderr);
      })
      .on("end", () => {
        console.log("Concatenate finished");
        io.emit('VIDEO_MERGED', fs.readFileSync('output.mp4'));

        tempFiles.forEach((file) => {
          fs.unlinkSync(file);
        });
      })
      .concat("output.mp4");
  });
});

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000");
});