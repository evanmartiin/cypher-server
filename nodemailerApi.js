import nodemailer from "nodemailer";

export default class nodemailerApi {
  constructor() {
    console.log(nodemailer);

    this.transporter = nodemailer.createTransport({
      host: "https://cypher-gobelins.herokuapp.com/",
      port: 587,
      secure: false, // upgrade later with STARTTLS
    });

    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });
  }
}
