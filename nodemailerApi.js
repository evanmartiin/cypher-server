

export default class nodemailerApi {
  constructor() {
    console.log(nodemailer);
    this.nodemailer = require('nodemailer')

    this.transporter = this.nodemailer.createTransport({
      host: "https://cypher-gobelins.herokuapp.com/",
      port: 587,
      secure: false, // upgrade later with STARTTLS
    });

    // verify connection configuration
    this.transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });
  }
}
