class Video {
  constructor() {
    this.videos = new Map();
  }

  saveVideo(video) {
    if (this.videos.has(video.id)) {
      this.videos.get(video.id).push(video);
    } else {
      this.videos.set(video.id, [video]);
    }

    if (video.length > video.index + 1) return;
  }

  async getVideo(buffers, id) {
    this.videos = buffers

    const videoBuffer = this.mergeVideoBuffers(id);
    const video = new Uint8Array(videoBuffer)
    const blob = new Blob([videoBuffer], {
        type: "video/mp4",
      });
    return video;
  }

  mergeVideoBuffers(id) {
    const buffers = this.videos.get(id);
    const mergedBuffer = buffers
      .sort((a, b) => a.index - b.index)
      .map((video) => video.buffer)
      .reduce((a, b) => this.mergeBuffers(a, b), new Uint8Array());
    this.videos.delete(id);
    return mergedBuffer;
  }

  mergeBuffers(buffer1, buffer2) {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
  }
}

module.exports = {
  Video,
};
