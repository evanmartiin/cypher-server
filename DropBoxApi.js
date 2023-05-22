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
        // console.log(response)
        // console.log(response.result)
        // console.log(response.result.fileBlob)
        // console.log(response.result.fileBinary)
        return response.result.fileBinary;
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
