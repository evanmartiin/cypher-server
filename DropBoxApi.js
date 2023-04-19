class DropBoxApi {
  constructor() {
    const Dropbox = require("dropbox").Dropbox;
    console.log(process.env.VITE_DROPBOX_KEY);
    const ACCESS_TOKEN = process.env.VITE_DROPBOX_KEY;
    this.dropbox = new Dropbox({ accessToken: ACCESS_TOKEN });
  }

  async getSingleVideo(path) {
    console.log(path);

    const res = this.dropbox
      .filesDownload({ path: path })
      .then((response) => {
        console.log(response)
        return response.result.fileBlob;
      })
      .catch((error) => {
        console.error(error);
      });

    return res;
  }
}

module.exports = {
  DropBoxApi,
};
